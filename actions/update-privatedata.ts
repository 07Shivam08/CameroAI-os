import { clerkClient } from "@clerk/nextjs/server";

export const updateUserPrivateData = async (
  userId: string,
  newData: Record<string, any>
) => {
  try {
    // Fetch existing metadata
    const user = await clerkClient.users.getUser(userId);
    const existingMetadata = user.privateMetadata || {};

    // Replace only specific fields and keep others unchanged
    const updatedMetadata = { 
      ...existingMetadata, 
      ...newData, // This will replace only the fields in newData
    };

    // Update user metadata
    await clerkClient.users.updateUser(userId, {
      privateMetadata: updatedMetadata,
    });

    console.log("User private metadata updated successfully.");
  } catch (error) {
    console.error("Error updating user private metadata:", error);
    throw error;
  }
};
