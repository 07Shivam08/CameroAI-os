import { clerkClient } from "@clerk/nextjs/server";

export async function deleteClerkUser(userId: string): Promise<boolean> {
  try {
    await clerkClient.users.deleteUser(userId);
    console.log(`User ${userId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}
