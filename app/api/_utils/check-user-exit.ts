import { clerkClient } from "@clerk/nextjs";

export async function checkUserExists(email: string): Promise<boolean> {
    try {
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });
      return users.length > 0;
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  }