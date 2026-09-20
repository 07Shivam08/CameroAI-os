"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Delete,
  MoreHorizontal,
  Pencil,
  UserCheck,
  Shield,
  Star,
  Crown,
  Mail,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";
import DisplayAndEditUser from "./dispalyandedit";

// This needs to be imported from the context where branches are available
let branchesData: any[] = [];

export const setBranchesData = (branches: any[]) => {
  branchesData = branches;
};

const handleDelete = async (userId: string) => {
  try {
    const response = await axios.delete(`/api/user/${userId}`);
    toast.success("User deleted successfully");
    window.location.reload(); // Refresh to update the table
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error("Failed to delete user");
    }
  }
};

// Helper function to get role icon and styling with Camero theme
const getRoleConfig = (role: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return {
        icon: Shield,
        variant: "destructive" as const,
        className:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg border-0",
      };
    case "user":
      return {
        icon: UserIcon,
        variant: "secondary" as const,
        className:
          "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg border-0",
      };
    default:
      return {
        icon: UserCheck,
        variant: "outline" as const,
        className:
          "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700 shadow-lg border-0",
      };
  }
};

// Helper function to get user initials
const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return first + last || "??";
};

export const UserColumns: ColumnDef<User>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50 text-slate-700 font-semibold"
        >
          <UserIcon className="mr-2 h-4 w-4" />
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { firstName, lastName, email } = row.original;
      const initials = getInitials(firstName, lastName);

      return (
        <div className="flex items-center gap-3 py-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-emerald-100">
              <span className="text-white font-semibold text-sm">
                {initials}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors">
              {firstName} {lastName}
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {email}
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const { firstName, lastName, email } = row.original;
      const searchValue = value.toLowerCase();
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const emailValue = email?.toLowerCase() || "";

      return fullName.includes(searchValue) || emailValue.includes(searchValue);
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50 text-slate-700 font-semibold"
        >
          <Shield className="mr-2 h-4 w-4" />
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.original.role;
      const config = getRoleConfig(role);
      const IconComponent = config.icon;

      return (
        <Badge
          variant={config.variant}
          className={`${config.className} font-medium px-3 py-1.5 rounded-full shadow-sm`}
        >
          <IconComponent className="mr-1.5 h-3 w-3" />
          {role?.toLowerCase() === "admin"
            ? "Administrator"
            : role?.charAt(0).toUpperCase() + role?.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "branch",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50 text-slate-700 font-semibold"
        >
          <Shield className="mr-2 h-4 w-4" />
          Branch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { branchId } = row.original;

      // Find the branch name from the branches data
      const getBranchName = (branchId: string) => {
        const branch = branchesData.find((b: any) => b.id === branchId);
        return branch ? `${branch.name} - ${branch.city}` : "Unknown Branch";
      };

      return (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              branchId ? "bg-blue-400 animate-pulse" : "bg-gray-400"
            }`}
          />
          <Badge
            variant={branchId ? "default" : "secondary"}
            className={`font-medium px-3 py-1 rounded-full shadow-sm ${
              branchId
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
            }`}
          >
            {branchId ? getBranchName(branchId) : "Unassigned"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50 text-slate-700 font-semibold"
        >
          <UserCheck className="mr-2 h-4 w-4" />
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { deparmentId, organizationId } = row.original;

      // Find the department name from the branches data
      const getDepartmentName = (deptId: string) => {
        for (const branch of branchesData) {
          const dept = branch.departments?.find((d: any) => d.id === deptId);
          if (dept) return dept.name;
        }
        return "Unknown Department";
      };

      return (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              deparmentId ? "bg-emerald-400 animate-pulse" : "bg-orange-400"
            }`}
          />
          <Badge
            variant={deparmentId ? "default" : "secondary"}
            className={`font-medium px-3 py-1 rounded-full shadow-sm ${
              deparmentId
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
            }`}
          >
            {deparmentId ? getDepartmentName(deparmentId) : "Unassigned"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-slate-700 font-semibold">Actions</div>,
    cell: ({ row }) => {
      const { email, userName, userId } = row.original;

      return (
        <div className="flex items-center gap-2">
          <DisplayAndEditUser user={row.original} branches={branchesData} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-50 rounded-full transition-colors"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-slate-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border-2 border-slate-200 shadow-lg"
            >
              <DropdownMenuItem asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex cursor-pointer w-full hover:bg-red-50 py-2 px-2 rounded text-red-600 items-center">
                      <Delete className="h-4 w-4 mr-2" />
                      Delete User
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] border-2 border-slate-200 shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-red-600 flex items-center gap-2">
                        <Delete className="h-5 w-5" />
                        Delete User
                      </DialogTitle>
                      <DialogDescription className="text-slate-600">
                        This action cannot be undone. This will permanently
                        delete the user account and remove all associated data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4 my-4">
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">
                          User Details
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email:</span>
                          <span className="font-medium text-slate-800">
                            {email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Username:</span>
                          <span className="font-medium text-slate-800">
                            {userName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className="border-slate-300 hover:bg-slate-50"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={async () => {
                            await handleDelete(userId);
                          }}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
                        >
                          <Delete className="h-4 w-4 mr-2" />
                          Delete User
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
