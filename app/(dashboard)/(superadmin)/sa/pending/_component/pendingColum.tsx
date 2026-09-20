"use client";

import { Organization } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  Building2,
  Mail,
  Phone,
  Users,
  CreditCard,
  AlertTriangle,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Extended type to include subscription information
type OrganizationWithSubscription = Organization & {
  hasActiveSubscription?: boolean;
  activeSubscription?: {
    plan: string;
    status: string;
    startDate: Date;
    endDate?: Date | null;
    isActive: boolean;
  } | null;
  admin?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
};

export const organizationColumns: ColumnDef<OrganizationWithSubscription>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-emerald-50 -ml-4"
        >
          <Building2 className="mr-2 h-4 w-4 text-emerald-600" />
          Organization
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-slate-800">{name}</div>
            <div className="text-sm text-slate-500">Pending Verification</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "contactsNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50 -ml-4"
        >
          <Phone className="mr-2 h-4 w-4 text-blue-600" />
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const contact = row.getValue("contactsNumber") as string;
      return (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-slate-700">{contact}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "orgEmail",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-purple-50 -ml-4"
        >
          <Mail className="mr-2 h-4 w-4 text-purple-600" />
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("orgEmail") as string;
      return (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-purple-500" />
          <span className="font-medium text-slate-700">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isPending",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-orange-50 -ml-4"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPending = row.getValue("isPending") as boolean;
      return (
        <Badge
          variant={isPending ? "destructive" : "default"}
          className={
            isPending
              ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }
        >
          {isPending ? "Pending" : "Verified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "organizationSize",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-indigo-50 -ml-4"
        >
          <Users className="mr-2 h-4 w-4 text-indigo-600" />
          Size
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const size = row.getValue("organizationSize") as string;
      return (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-indigo-500" />
          <span className="font-medium text-slate-700">{size} employees</span>
        </div>
      );
    },
  },
  {
    accessorKey: "hasActiveSubscription",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-green-50 -ml-4"
        >
          <CreditCard className="mr-2 h-4 w-4 text-green-600" />
          Subscription
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const hasActiveSubscription = row.getValue(
        "hasActiveSubscription"
      ) as boolean;
      const activeSubscription = row.original.activeSubscription;

      if (!activeSubscription) {
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <CreditCard className="mr-1 h-3 w-3" />
            No Subscription
          </Badge>
        );
      }

      const isActive = hasActiveSubscription && activeSubscription.isActive;

      return (
        <div className="flex flex-col space-y-1">
          <Badge
            variant={isActive ? "default" : "destructive"}
            className={
              isActive
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }
          >
            <CreditCard className="mr-1 h-3 w-3" />
            {activeSubscription.plan} - {activeSubscription.status}
          </Badge>
          {!isActive && (
            <div className="flex items-center text-xs text-red-600">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Subscription Required
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id, createdBy, hasActiveSubscription, activeSubscription } =
        row.original;
      const canVerify = hasActiveSubscription && activeSubscription?.isActive;

      const updateOrg = async () => {
        if (!canVerify) {
          toast.error(
            "Organization must have an active subscription to be verified"
          );
          return;
        }

        try {
          const response = await axios.post("/api/organisation/verify", {
            organizationId: id,
            userId: createdBy,
          });

          toast.success("Organization verified successfully!");
          window.location.reload();
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white border-slate-200 shadow-lg rounded-xl min-w-[160px]"
          >
            <DropdownMenuItem
              onClick={updateOrg}
              disabled={!canVerify}
              className={`cursor-pointer rounded-lg m-1 p-3 ${
                canVerify
                  ? "hover:bg-emerald-50"
                  : "opacity-50 cursor-not-allowed hover:bg-gray-50"
              }`}
            >
              {canVerify ? (
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
              ) : (
                <Shield className="mr-2 h-4 w-4 text-gray-400" />
              )}
              <span className="font-medium">
                {canVerify
                  ? "Verify Organization"
                  : "Requires Active Subscription"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
