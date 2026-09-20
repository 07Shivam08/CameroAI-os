import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";

// Validation schemas
const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  branchId: z.string().min(1, "Branch ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

const app = new Hono()
  // Get all branches for an organization
  .get("/branches/:orgId", async (c) => {
    try {
      const orgId = c.req.param("orgId");

      const branches = await db.branch.findMany({
        where: {
          organizationId: orgId,
        },
        include: {
          departments: {
            include: {
              _count: {
                select: {
                  users: true,
                },
              },
            },
          },
          _count: {
            select: {
              users: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      return c.json(branches, 200);
    } catch (error) {
      console.error("Error fetching branches:", error);
      return c.json({ message: "Error fetching branches" }, 500);
    }
  })

  // Create a new branch
  .post("/branches", zValidator("json", branchSchema), async (c) => {
    try {
      const data = c.req.valid("json");

      const branch = await db.branch.create({
        data: {
          name: data.name,
          city: data.city,
          state: data.state,
          organizationId: data.organizationId,
          createdBy: "admin", // You might want to get this from auth context
        },
        include: {
          departments: true,
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      return c.json(branch, 201);
    } catch (error) {
      console.error("Error creating branch:", error);
      return c.json({ message: "Error creating branch" }, 500);
    }
  })

  // Update a branch
  .patch(
    "/branches/:id",
    zValidator("json", branchSchema.partial()),
    async (c) => {
      try {
        const id = c.req.param("id");
        const data = c.req.valid("json");

        const branch = await db.branch.update({
          where: { id },
          data,
          include: {
            departments: true,
            _count: {
              select: {
                users: true,
              },
            },
          },
        });

        return c.json(branch, 200);
      } catch (error) {
        console.error("Error updating branch:", error);
        return c.json({ message: "Error updating branch" }, 500);
      }
    }
  )

  // Delete a branch
  .delete("/branches/:id", async (c) => {
    try {
      const id = c.req.param("id");

      // Check if branch has users
      const userCount = await db.user.count({
        where: { branchId: id },
      });

      if (userCount > 0) {
        return c.json(
          { message: "Cannot delete branch with existing users" },
          400
        );
      }

      await db.branch.delete({
        where: { id },
      });

      return c.json({ message: "Branch deleted successfully" }, 200);
    } catch (error) {
      console.error("Error deleting branch:", error);
      return c.json({ message: "Error deleting branch" }, 500);
    }
  })

  // Create a new department
  .post("/departments", zValidator("json", departmentSchema), async (c) => {
    try {
      const data = c.req.valid("json");

      const department = await db.department.create({
        data: {
          name: data.name,
          branchId: data.branchId,
          organiationId: data.organizationId,
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      return c.json(department, 201);
    } catch (error) {
      console.error("Error creating department:", error);
      return c.json({ message: "Error creating department" }, 500);
    }
  })

  // Update a department
  .patch(
    "/departments/:id",
    zValidator("json", departmentSchema.partial()),
    async (c) => {
      try {
        const id = c.req.param("id");
        const data = c.req.valid("json");

        const department = await db.department.update({
          where: { id },
          data: {
            name: data.name,
          },
          include: {
            _count: {
              select: {
                users: true,
              },
            },
          },
        });

        return c.json(department, 200);
      } catch (error) {
        console.error("Error updating department:", error);
        return c.json({ message: "Error updating department" }, 500);
      }
    }
  )

  // Delete a department
  .delete("/departments/:id", async (c) => {
    try {
      const id = c.req.param("id");

      // Check if department has users
      const userCount = await db.user.count({
        where: { deparmentId: id },
      });

      if (userCount > 0) {
        return c.json(
          { message: "Cannot delete department with existing users" },
          400
        );
      }

      await db.department.delete({
        where: { id },
      });

      return c.json({ message: "Department deleted successfully" }, 200);
    } catch (error) {
      console.error("Error deleting department:", error);
      return c.json({ message: "Error deleting department" }, 500);
    }
  });

export default app;
