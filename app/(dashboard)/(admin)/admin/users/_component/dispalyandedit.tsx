"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Branch, Department, Role } from "@prisma/client";
import {
  Loader2,
  Save,
  X,
  Shield,
  UserCheck,
  Crown,
  Pencil,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface ExtendedBranch extends Branch {
  departments: Department[];
}

interface EditUserModalProps {
  user: ExtendedUser;
  branches: ExtendedBranch[];
}

export default function DisplayAndEditUser({
  user,
  branches,
}: EditUserModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    user.branchId || ""
  );
  const [availableDepartments, setAvailableDepartments] = useState<
    Department[]
  >([]);
  const router = useRouter();
  const updateUser = useUpdateUser();

  // Debug logs
  console.log("DisplayAndEditUser - user:", user);
  console.log("DisplayAndEditUser - branches:", branches);
  console.log("DisplayAndEditUser - user.branchId:", user.branchId);
  console.log("DisplayAndEditUser - user.deparmentId:", user.deparmentId);

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
  // Reset form when user changes
  useEffect(() => {
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
    console.log(
      "Modal - Branch change effect - selectedBranchId:",
      selectedBranchId
    );
    console.log("Modal - Branch change effect - branches:", branches);

    if (selectedBranchId && branches && Array.isArray(branches)) {
      const selectedBranch = branches.find(
        (b) => b && b.id === selectedBranchId
      );
      console.log("Modal - Selected branch:", selectedBranch);

      const departments = selectedBranch?.departments || [];
      console.log("Modal - Available departments:", departments);

      setAvailableDepartments(departments);

      // Reset department selection if it's not available in the new branch
      const currentDepartmentId = form.getValues("departmentId");
      const isDepartmentAvailable = departments.some(
        (dept) => dept && dept.id === currentDepartmentId
      );

      if (!isDepartmentAvailable) {
        form.setValue("departmentId", "");
      }
    } else {
      console.log("Modal - No branch selected or branches not available");
      setAvailableDepartments([]);
    }
  }, [selectedBranchId, branches, form]);

  // Set initial departments - Enhanced for browser compatibility
  useEffect(() => {
    console.log(
      "Modal - Initial departments effect - user.branchId:",
      user.branchId
    );
    console.log("Modal - Initial departments effect - branches:", branches);

    if (user.branchId && branches && Array.isArray(branches)) {
      const userBranch = branches.find((b) => b && b.id === user.branchId);
      console.log("Modal - User branch:", userBranch);

      const initialDepartments = userBranch?.departments || [];
      console.log("Modal - Initial departments:", initialDepartments);

      setAvailableDepartments(initialDepartments);
    } else {
      console.log("Modal - No user branch or branches not available");
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
      setOpen(false);
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-300 transition-colors"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Edit User Profile
          </DialogTitle>
          <p className="text-sm text-slate-600 mt-1">
            As an admin, you can update this user's profile information, branch,
            department, and role permissions.
          </p>
        </DialogHeader>

        <div className="flex items-center gap-3 py-4 border-b">
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="flex items-center gap-3 pt-4 border-t">
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
