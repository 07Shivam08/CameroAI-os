import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { checkUserExists } from "../_utils/check-user-exit";
import { generatePassword } from "../_utils/generatePassword";
import { sendEmail } from "../_utils/email-sender";
import { deleteClerkUser } from "../_utils/delete-user";
import { getUserPrivateDataBoolean } from "@/actions/get-user-privatedata";
const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  orgId: z.string().min(1, "Organization ID is required"),
  email: z.string().email("Invalid email format"),
  userId: z.string().optional(),
  branchId: z.string().min(1, "Branch ID is required"),
  departmentId: z.string().min(1, "Department ID is required"),
  role: z.nativeEnum(Role),
});

// Validation schema for user creation
const updateUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  branchId: z.string(),
  departmentId: z.string(),
  role: z.nativeEnum(Role),
});

const app = new Hono()

  .get(
    "/context/:userId",
    zValidator(
      "param",
      z.object({
        userId: z.string().optional(),
      })
    ),
    async (c) => {
      const { userId } = c.req.valid("param");

      if (!userId)
        return c.json(" ERROR FETCHING USER CONTEXT", { status: 401 });

      try {
        const USER = await db.user.findUnique({
          where: {
            userId,
          },

          include: {
            branch: true,
            department: true,
            organization: {
              include: {
                _count: {
                  select: {
                    users: true,
                  },
                },

                activeSubscription: true,
              },
            },
          },
        });

        if (!USER) {
          return c.json("USER DOES NOT EXIST CONTEXT", { status: 401 });
        }
        const verified = await getUserPrivateDataBoolean(USER.userId);
        const { organization, ...user } = USER;
        return c.json(
          {
            user,
            organization,
            verified,
            activeSubscription: organization?.activeSubscription ?? null,
          },
          { status: 200 }
        );
      } catch (error) {
        return c.json(`INTERNAL SERVER ERROR : ${c.req.url} `, { status: 500 });
      }
    }
  )
  .post("/", zValidator("json", userSchema), async (c) => {
    try {
      const userData = c.req.valid("json");
      const userName = userData.email.replace(/[^a-zA-Z0-9]/g, "");

      if (await checkUserExists(userData.email)) {
        return c.json({ message: "Email already exists" }, 409);
      }

      const password = generatePassword(8);
      const auth = await clerkClient.users.createUser({
        username: userName,
        emailAddress: [userData.email],
        password,
      });

      const user = await db.user.create({
        data: {
          userName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password,
          organizationId: userData.orgId,
          branchId: userData.branchId,
          deparmentId: userData.departmentId,
          role: userData.role,
          userId: auth.id,
          imageUrl: "", // Can be updated later
        },
      });

      // Profile information is stored directly in the User model
      // No need for separate profile creation

      await sendEmail(user);
      return c.json({ message: "Success" }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ message: "Internal server error" }, 500);
    }
  })
  .patch(
    "/:userId",
    zValidator("json", updateUserSchema.partial()),
    async (c) => {
      try {
        const userId = c.req.param("userId");
        const values = c.req.valid("json");

        // Map departmentId to deparmentId to match database schema
        const updateData = {
          ...values,
          deparmentId: values.departmentId,
        };

        // Remove the departmentId field since we're using deparmentId
        delete updateData.departmentId;

        await db.user.update({
          where: { userId },
          data: updateData,
        });

        return c.json({ message: "User updated successfully" }, 200);
      } catch (error) {
        console.error(error);
        return c.json({ message: "Error updating user" }, 500);
      }
    }
  )
  .delete("/:userId", async (c) => {
    const userId = c.req.param("userId");

    try {
      await deleteClerkUser(userId);
      await db.$transaction(async (ctx) => {
        // First find all chats associated with this user
        const userChats = await ctx.chat.findMany({
          where: { userId },
        });

        // Delete all messages in these chats
        if (userChats.length > 0) {
          await ctx.message.deleteMany({
            where: {
              chatId: {
                in: userChats.map((chat) => chat.id),
              },
            },
          });

          // Then delete the chats themselves
          await ctx.chat.deleteMany({
            where: { userId },
          });
        }

        // Now we can safely delete the user
        await ctx.user.delete({ where: { userId } });
      });

      return c.json({ message: "User Deleted" }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ message: "Unable to delete" }, 500);
    }
  });

export default app;
