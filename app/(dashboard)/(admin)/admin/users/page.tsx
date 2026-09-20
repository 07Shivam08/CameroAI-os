import { auth } from "@clerk/nextjs";
import React from "react";
import { CreateUserForm } from "./_component/createUserForm";
import { UserColumns } from "./_component/userColums";
import { db } from "@/lib/db";
import { UserDataTable } from "./_component/UserTable";
import getOrganization from "@/actions/get-organization";
import {
  Shield,
  Users,
  UserPlus,
  Database,
  Activity,
  TrendingUp,
} from "lucide-react";
import { AdminOnly } from "@/lib/role-guard";

export default async function Page() {
  const { userId } = await auth();
  const org = await getOrganization();

  if (!userId || !org) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Please create an account
          </h1>
          <p className="text-slate-600 mt-2">
            You need to be authenticated to access this page.
          </p>
        </div>
      </div>
    );
  }

  const orgUser = await db.organization.findUnique({
    where: {
      id: org.id,
    },
    select: {
      users: true,
    },
  });

  const totalUsers = orgUser?.users.length || 0;
  const activeUsers =
    orgUser?.users.filter((user) => user.badges && user.badges > 0).length || 0;
  const adminUsers =
    orgUser?.users.filter((user) => user.role === "ADMIN").length || 0;

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                User Management Hub
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your organization's users and access controls
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {totalUsers}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-slate-500 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {activeUsers}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-slate-500">Last 24 hours</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Administrators
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {adminUsers}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-slate-500">Admin access level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Create User Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <UserPlus className="h-6 w-6 text-white" />
                <h2 className="text-xl font-semibold text-white">
                  Add New User
                </h2>
              </div>
            </div>
            <div className="p-6">
              <CreateUserForm orgId={org?.id} branchs={org.branches} />
            </div>
          </div>

          {/* Users Table Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-white" />
                <h2 className="text-xl font-semibold text-white">
                  Users Directory
                </h2>
              </div>
            </div>
            <div className="p-6">
              {orgUser && (
                <UserDataTable
                  columns={UserColumns}
                  data={orgUser.users}
                  branches={org.branches}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
}
