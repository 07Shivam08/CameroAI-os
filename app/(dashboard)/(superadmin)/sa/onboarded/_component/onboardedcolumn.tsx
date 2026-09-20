"use client";

import { Organization } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Building2,
  Mail,
  Phone,
  Users,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const organizationColumns: ColumnDef<Organization>[] = [
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
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-slate-800">{name}</div>
            <div className="text-sm text-green-600 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified & Active
            </div>
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
          className="hover:bg-green-50 -ml-4"
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
          variant="default"
          className="bg-green-100 text-green-800 hover:bg-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
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
];
