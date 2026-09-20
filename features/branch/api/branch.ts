import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferResponseType, InferRequestType } from "hono";

// Types for Branch operations
export type Branch = {
  id: string;
  name: string;
  city: string;
  state: string;
  organizationId: string;
  departments: Department[];
  _count: {
    users: number;
  };
};

export type Department = {
  id: string;
  name: string;
  branchId: string;
  organiationId: string;
  _count: {
    users: number;
  };
};

export type CreateBranchPayload = {
  name: string;
  city: string;
  state: string;
  organizationId: string;
};

export type CreateDepartmentPayload = {
  name: string;
  branchId: string;
  organizationId: string;
};

// Get branches for organization
export function useBranches(orgId: string) {
  return useQuery({
    queryKey: ["branches", orgId],
    queryFn: async () => {
      const response = await client.api.branch.branches[":orgId"].$get({
        param: { orgId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      return response.json();
    },
    enabled: !!orgId,
  });
}

// Create Branch Mutation
export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["branch:create"],
    mutationFn: async (branchData: CreateBranchPayload) => {
      const response = await client.api.branch.branches.$post({
        json: branchData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create branch");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch branches
      queryClient.invalidateQueries({
        queryKey: ["branches", data.organizationId],
      });
    },
  });
}

// Update Branch Mutation
export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["branch:update"],
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateBranchPayload>;
    }) => {
      const response = await client.api.branch.branches[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update branch");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch branches
      queryClient.invalidateQueries({
        queryKey: ["branches", data.organizationId],
      });
    },
  });
}

// Delete Branch Mutation
export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["branch:delete"],
    mutationFn: async ({ id, orgId }: { id: string; orgId: string }) => {
      const response = await client.api.branch.branches[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete branch");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch branches
      queryClient.invalidateQueries({
        queryKey: ["branches", variables.orgId],
      });
    },
  });
}

// Create Department Mutation
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["department:create"],
    mutationFn: async (departmentData: CreateDepartmentPayload) => {
      const response = await client.api.branch.departments.$post({
        json: departmentData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create department");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch branches to update department counts
      queryClient.invalidateQueries({
        queryKey: ["branches", data.organiationId],
      });
    },
  });
}

// Update Department Mutation
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["department:update"],
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateDepartmentPayload>;
    }) => {
      const response = await client.api.branch.departments[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update department");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch branches
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

// Delete Department Mutation
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["department:delete"],
    mutationFn: async ({ id, orgId }: { id: string; orgId: string }) => {
      const response = await client.api.branch.departments[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete department");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch branches
      queryClient.invalidateQueries({
        queryKey: ["branches", variables.orgId],
      });
    },
  });
}
