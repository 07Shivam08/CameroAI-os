import { client } from "@/lib/hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Role } from "@prisma/client";
import { InferResponseType } from "hono";

// Type for Create User payload
export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  orgId: string;
  email: string;
  branchId: string;
  departmentId: string;
  role: Role;
};

// Type for Update User payload
export type UpdateUserPayload = {
  userId: string;
  updateData: Partial<{
    firstName: string;
    lastName: string;
    branchId: string;
    departmentId: string;
    role: Role;
  }>;
};

export type TUserContext = InferResponseType<typeof client.api.user.context[':userId']['$get'] , 200>

// Create User Mutation
export function useCreateUser() {
  return useMutation({
    mutationKey: ["user:create"],
    mutationFn: async (userData: CreateUserPayload) => {
      const res = await client.api.user.$post({ json: userData });
      if (!res.ok) throw new Error("Failed to create user");
      return res.json();
    },
    // Optionally, you can invalidate or update queries on success if needed.
  });
}

// Update User Mutation
export function useUpdateUser() {
  return useMutation({
    mutationKey: ["user:update"],
    mutationFn: async ({ userId, updateData }: UpdateUserPayload) => {
      const res = await client.api.user[":userId"].$patch({
        param: { userId },
        json: updateData,
      });
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: () => {},
  });
}

// Delete User Mutation
export function useDeleteUser() {
  return useMutation({
    mutationKey: ["user:delete"],
    mutationFn: async (userId: string) => {
      const res = await client.api.user[":userId"].$delete({
        param: { userId },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    },
  });
}

export function useGetUserContext(userId: string | undefined) {
  return useQuery({
    enabled: !!userId,
    queryKey: ["user:context", userId],
    queryFn: async () => {
      const res = await client.api.user.context[":userId"].$get({
        param: {
          userId,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch company articles");
      }

      return await res.json();
    },
  });
}

 