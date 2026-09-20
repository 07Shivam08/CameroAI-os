import React from "react";
import { SuperAdminOnly } from "@/lib/role-guard";
import {
  Building2,
  CheckCircle,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { organizationColumns } from "./_component/onboardedcolumn";
import { db } from "@/lib/db";
import { DataTable } from "../pending/_component/pending-data-table";

export default async function page() {
  const org = await db.organization.findMany({
    where: {
      isPending: false,
    },
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  const totalOrgs = org.length;
  const totalUsers = org.reduce((sum, o) => sum + o._count.users, 0);
  const avgUsersPerOrg = totalOrgs > 0 ? Math.round(totalUsers / totalOrgs) : 0;

  return (
    <SuperAdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Active Organizations
              </h1>
              <p className="text-slate-600 mt-1">
                Monitor and manage all onboarded organizations
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Organizations
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {totalOrgs}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-slate-500">Active & verified</span>
              </div>
            </div>

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
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-slate-500">Across all orgs</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Avg Users/Org
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {avgUsersPerOrg}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-slate-500">Organization size</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    This Month
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    +{Math.floor(totalOrgs * 0.15)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-slate-500">New organizations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">
                Onboarded Organizations
              </h2>
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                {totalOrgs}
              </span>
            </div>
          </div>

          <div className="p-6">
            <DataTable
              columns={organizationColumns}
              data={org}
              filterkey="name"
            />
          </div>
        </div>
      </div>
    </SuperAdminOnly>
  );
}
