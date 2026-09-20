"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Branch, Department, Role } from "@prisma/client";
import { Loader2, Save, X, Shield, UserCheck, Crown } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useUpdateUser } from "@/features/user/api/user";

const userUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  branchId: z.string().min(1, "Branch is required"),
  departmentId: z.string().min(1, "Department is required"),
  role: z.nativeEnum(Role),
});

type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

interface ExtendedUser extends User {
  branch?: Branch;
  department?: Department;
}

interface EditUserFormProps {
  user: ExtendedUser;
  branches: (Branch & {
    departments: Department[];
  })[];
  onClose: () => void;
}

export function EditUserForm({ user, branches, onClose }: EditUserFormProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    user.branchId || ""
  );
  const [availableDepartments, setAvailableDepartments] = useState<
    Department[]
  >([]);
  const router = useRouter();
  const { user: currentUser } = useUser();
  const updateUser = useUpdateUser();

  // Debug logs - Enhanced for browser compatibility
  console.log("EditUserForm - Browser:", navigator.userAgent);
  console.log("EditUserForm - user:", JSON.stringify(user, null, 2));
  console.log("EditUserForm - branches:", JSON.stringify(branches, null, 2));
  console.log("EditUserForm - user.branchId:", user.branchId);
  console.log("EditUserForm - user.deparmentId:", user.deparmentId);
  console.log("EditUserForm - branches length:", branches?.length || 0);

  const form = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      branchId: user.branchId || "",
      departmentId: user.deparmentId || "",
      role: user.role,
    },
  });

  // Enhanced logging for debugging
  console.log("Form default values:", form.getValues());
  console.log("Form errors:", form.formState.errors);

  // Reset form when user changes (for browser compatibility)
  useEffect(() => {
    console.log("User change effect - resetting form");
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      branchId: user.branchId || "",
      departmentId: user.deparmentId || "",
      role: user.role,
    });
    setSelectedBranchId(user.branchId || "");
  }, [user, form]);

  // Update departments when branch changes - Enhanced for browser compatibility
  useEffect(() => {
    console.log("Branch change effect - selectedBranchId:", selectedBranchId);
    console.log("Branch change effect - branches:", branches);

    if (selectedBranchId && branches && Array.isArray(branches)) {
      const selectedBranch = branches.find(
        (b) => b && b.id === selectedBranchId
      );
      console.log("Selected branch:", selectedBranch);

      const departments = selectedBranch?.departments || [];
      console.log("Available departments:", departments);

      setAvailableDepartments(departments);

      // Reset department selection if it's not available in the new branch
      const currentDepartmentId = form.getValues("departmentId");
      const isDepartmentAvailable = departments.some(
        (dept) => dept && dept.id === currentDepartmentId
      );

      console.log("Current department ID:", currentDepartmentId);
      console.log("Is department available:", isDepartmentAvailable);

      if (!isDepartmentAvailable) {
        form.setValue("departmentId", "");
      }
    } else {
      console.log("No branch selected or branches not available");
      setAvailableDepartments([]);
    }
  }, [selectedBranchId, branches, form]);

  // Set initial departments - Enhanced for browser compatibility
  useEffect(() => {
    console.log("Initial departments effect - user.branchId:", user.branchId);
    console.log("Initial departments effect - branches:", branches);

    if (user.branchId && branches && Array.isArray(branches)) {
      const userBranch = branches.find((b) => b && b.id === user.branchId);
      console.log("User branch:", userBranch);

      const initialDepartments = userBranch?.departments || [];
      console.log("Initial departments:", initialDepartments);

      setAvailableDepartments(initialDepartments);
    } else {
      console.log("No user branch or branches not available");
    }
  }, [user.branchId, branches]);

  const onSubmit = async (data: UserUpdateFormData) => {
    try {
      await updateUser.mutateAsync({
        userId: user.userId,
        updateData: {
          firstName: data.firstName,
          lastName: data.lastName,
          branchId: data.branchId,
          departmentId: data.departmentId,
          role: data.role,
        },
      });

      toast.success("User updated successfully!");
      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    }
  };

  const getRoleConfig = (role: Role | string) => {
    switch (role) {
      case "ADMIN":
        return {
          icon: Shield,
          color: "bg-red-500",
          label: "Administrator",
        };
      case "USER":
        return {
          icon: UserCheck,
          color: "bg-emerald-500",
          label: "User",
        };
      default:
        return {
          icon: UserCheck,
          color: "bg-slate-500",
          label: "User",
        };
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Edit User Profile
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-slate-600">
          As an admin, you can update this user's profile information, branch,
          department, and role permissions.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold">
              {user.firstName?.charAt(0)?.toUpperCase() || ""}
              {user.lastName?.charAt(0)?.toUpperCase() || ""}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-slate-800">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Email (Read-only)</Label>
              <Input
                value={user.email || ""}
                disabled
                className="bg-slate-100 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500">
                ⚠️ Email addresses cannot be changed for security and
                authentication reasons
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedBranchId(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches &&
                        Array.isArray(branches) &&
                        branches.length > 0 ? (
                          branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name} - {branch.city}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No branches available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedBranchId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDepartments &&
                        Array.isArray(availableDepartments) &&
                        availableDepartments.length > 0 ? (
                          availableDepartments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            {selectedBranchId
                              ? "No departments in this branch"
                              : "Select a branch first"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role & Permissions</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["USER", "ADMIN"].map((role) => {
                        const config = getRoleConfig(role as Role);
                        const IconComponent = config.icon;
                        return (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {config.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    💡 You can promote users to admin or change their role as
                    needed
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={updateUser.isPending}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                {updateUser.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update User
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
