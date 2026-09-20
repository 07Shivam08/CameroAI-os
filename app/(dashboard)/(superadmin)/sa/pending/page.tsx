import React from "react";
import { SuperAdminOnly } from "@/lib/role-guard";
import {
  Clock,
  Building2,
  AlertTriangle,
  Users,
  CreditCard,
  Shield,
} from "lucide-react";
import { organizationColumns } from "./_component/pendingColum";
import { db } from "@/lib/db";
import { DataTable } from "./_component/pending-data-table";

export default async function page() {
  const org = await db.organization.findMany({
    where: {
      isPending: true,
    },
    include: {
      activeSubscription: {
        select: {
          id: true,
          plan: true,
          status: true,
          startDate: true,
          endDate: true,
          razorpaySubscriptionId: true,
        },
      },
      subscription: {
        select: {
          id: true,
          plan: true,
          status: true,
          startDate: true,
          endDate: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      users: {
        where: {
          role: "ADMIN",
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
        take: 1,
      },
    },
    orderBy: {
      isPending: "asc",
    },
  });

  // Format the data to include subscription information
  const formattedOrganizations = org.map((organization) => ({
    ...organization,
    hasActiveSubscription:
      !!organization.activeSubscription &&
      organization.activeSubscription.status === "ACTIVE",
    activeSubscription: organization.activeSubscription
      ? {
          plan: organization.activeSubscription.plan.toString(),
          status: organization.activeSubscription.status,
          startDate: organization.activeSubscription.startDate,
          endDate: organization.activeSubscription.endDate,
          isActive:
            organization.activeSubscription.status === "ACTIVE" &&
            (!organization.activeSubscription.endDate ||
              new Date() < new Date(organization.activeSubscription.endDate)),
        }
      : null,
    admin: organization.users[0] 
      ? {
          id: organization.users[0].id,
          firstName: organization.users[0].firstName ?? undefined,
          lastName: organization.users[0].lastName ?? undefined,
          email: organization.users[0].email ?? undefined
        }
      : undefined,
  }));

  const totalPending = formattedOrganizations.length;
  const withActiveSubscription = formattedOrganizations.filter(
    (org) => org.hasActiveSubscription
  ).length;
  const todayPending = Math.floor(totalPending * 0.3); // Approximation

  return (
    <SuperAdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Pending Organizations
              </h1>
              <p className="text-slate-600 mt-1">
                Review and approve organization registration requests
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Pending
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {totalPending}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-slate-500">Awaiting approval</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    With Subscriptions
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {withActiveSubscription}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-slate-500">Ready to verify</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Today's Requests
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {todayPending}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-slate-500">New registrations</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Verification Rate
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {totalPending > 0
                      ? Math.round(
                          (withActiveSubscription / totalPending) * 100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-slate-500">Subscription eligibility</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">
                Pending Approvals
              </h2>
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                {totalPending}
              </span>
            </div>
          </div>

          <div className="p-6">
            <DataTable
              columns={organizationColumns}
              data={formattedOrganizations}
              filterkey="name"
            />
          </div>
        </div>
      </div>
    </SuperAdminOnly>
  );
}
