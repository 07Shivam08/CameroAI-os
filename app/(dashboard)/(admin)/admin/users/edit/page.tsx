"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, User as UserIcon } from "lucide-react";
import { User, Branch, Department } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { EditUserForm } from "./EditUserForm";
import { useGetUserContext } from "@/features/user/api/user";
import getOrganization from "@/actions/get-organization";
import { useQuery } from "@tanstack/react-query";

interface ExtendedUser extends User {
  branch?: Branch;
  department?: Department;
}

interface ExtendedBranch extends Branch {
  departments: Department[];
}

export default function EditUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const { data: userContext, isLoading: isUserLoading } = useGetUserContext(
    userId || undefined
  );

  const { data: organization, isLoading: isOrgLoading } = useQuery({
    queryKey: ["organization"],
    queryFn: getOrganization,
  });

  const handleClose = () => {
    router.push("/admin/users");
  };

  if (isUserLoading || isOrgLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-slate-600">Loading user data...</span>
        </div>
      </div>
    );
  }

  if (!userContext || !organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            User Not Found
          </h1>
          <p className="text-slate-600 mb-4">
            The requested user could not be found or you don't have permission
            to edit them.
          </p>
          <Button onClick={handleClose} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Edit User
              </h1>
              <p className="text-slate-600 mt-1">
                Modify user information and permissions
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <EditUserForm
          user={userContext.user as ExtendedUser}
          branches={organization.branches as ExtendedBranch[]}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
