import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { User } from "@prisma/client";



const getUser = async (): Promise<null | User> => {
  const { userId } = auth();

  if (!userId) return null;
  try {
    const user = await db.user.findFirst({
      where: {
        userId: userId,
      },
    });

    return user;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export default getUser;

export const getUserfullDetail = async (username?: string) => {
  const { userId } = auth();
  if (!userId) return null;
  try {
    if (username == undefined) {
      return await db.user.findFirst({
        where: {
          userId: userId,
        },
        include: {
          department: true,
          branch: true,
        },
      });
    } else {
      return await db.user.findFirst({
        where: {
          userName: username,
        },
        include: {
          department: true,
          branch: true,
        },
      });
    }
  } catch (error) {
    return null;
  }
};
