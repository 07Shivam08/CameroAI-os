"use client";

import { AdminOnly } from "@/lib/role-guard";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavbarStore } from "@/app/(dashboard)/_components/layoutWrapper";
import { formatDaysLeft, formatStartDate } from "@/actions/date-formatter";
import {
  CreditCard,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Check,
  Clock,
  Zap,
  Crown,
  Building2,
} from "lucide-react";

export default function BillingPage() {
  // Get data from store, with fallbacks for missing data
  const { activeSubscription, organization, plan } = useNavbarStore();

  // Default to Starter plan if no plan exists
  const currentPlan = plan || {
    name: "STARTER",
    limits: {
      usersLimit: 5,
      integrationsLimit: 3,
      storageLimit: 1024, // 1GB
    },
    isExpired: false,
    key: "starter",
  };

  const { limits, isExpired, key } = currentPlan;
  // Available plans for upgrade
  const availablePlans = [
    {
      name: "Starter",
      key: "STARTER",
      price: 0,
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 users",
        "Basic AI Chat Support",
        "3 integrations",
        "1GB storage",
        "Email support",
      ],
      color: "from-green-500 to-emerald-600",
      popular: false,
    },
    {
      name: "Professional",
      key: "PROFESSIONAL",
      price: 29,
      description: "Advanced features for growing organizations",
      features: [
        "Up to 50 users",
        "Advanced AI Chat Support",
        "All integrations included",
        "10GB storage",
        "Priority support",
        "Analytics dashboard",
      ],
      color: "from-blue-500 to-purple-600",
      popular: true,
    },
    {
      name: "Enterprise",
      key: "ENTERPRISE",
      price: 99,
      description: "Complete solution for large organizations",
      features: [
        "Unlimited users",
        "Enterprise AI Chat Support",
        "Custom integrations",
        "Unlimited storage",
        "24/7 dedicated support",
        "Advanced analytics",
        "Custom AI model training",
      ],
      color: "from-purple-500 to-pink-600",
      popular: false,
    },
  ];

  const currentPlanName = currentPlan?.name || "STARTER";
  const currentPlanDetails = availablePlans.find(
    (p) => p.key === currentPlanName.toUpperCase()
  );

  // Hard-coded usage data for example
  const totalUsersAllowed = limits.usersLimit;
  const currentUsersCount = organization?._count?.users ?? 0;
  const usagePercent = Math.min(
    (currentUsersCount / totalUsersAllowed) * 100,
    100
  );

  // Example payment method data
  const paymentMethod = {
    cardBrand: "Visa",
    last4: "4242",
    expiry: "12/2025",
    billingEmail: organization?.orgEmail || "billing@company.com",
  };

  // Example invoices
  const invoices = [
    {
      id: "INV-001",
      date: "2024-12-01",
      status: "PAID",
      amount: "$29.00",
      plan: "Professional",
    },
    {
      id: "INV-002",
      date: "2024-11-01",
      status: "PAID",
      amount: "$29.00",
      plan: "Professional",
    },
  ];

  const expireText = activeSubscription?.endDate
    ? formatDaysLeft(activeSubscription.endDate)
    : "No expiration";
  const startText = activeSubscription?.startDate
    ? formatStartDate(activeSubscription.startDate)
    : "Not started";

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Financial Center
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your subscription, billing, and payment details
              </p>
            </div>
          </div>

          {/* Current Plan Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Current Plan Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${
                        currentPlanDetails?.color ||
                        "from-green-500 to-emerald-600"
                      } rounded-xl`}
                    >
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        {currentPlanDetails?.name || "Starter"} Plan
                      </h2>
                      <p className="text-slate-600">
                        {currentPlanDetails?.description ||
                          "Basic plan features"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-800">
                      ${currentPlanDetails?.price || 0}
                    </div>
                    <div className="text-slate-500 text-sm">per month</div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">
                        Users
                      </span>
                      <span className="text-sm text-slate-500">
                        {currentUsersCount}/{totalUsersAllowed}
                      </span>
                    </div>
                    <Progress value={usagePercent} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">
                      {Math.round(usagePercent)}% of limit used
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">
                        Storage
                      </span>
                      <span className="text-sm text-slate-500">
                        2.1GB/{((limits as any).storageLimit || 1024) / 1024}GB
                      </span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">
                      30% of storage used
                    </p>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Current Plan Features
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentPlanDetails?.features
                      .slice(0, 4)
                      .map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-slate-600">
                            {feature}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="space-y-6">
              {/* Subscription Status */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Subscription Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        activeSubscription?.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activeSubscription?.status === "ACTIVE"
                            ? "bg-green-400"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      {activeSubscription?.status || "Free"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Started</span>
                    <span className="text-sm text-slate-700">{startText}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Next billing</span>
                    <span className="text-sm text-slate-700">{expireText}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Available Plans for Upgrade */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Upgrade Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan, index) => {
                const isCurrentPlan =
                  plan.key === currentPlanName.toUpperCase();
                return (
                  <div
                    key={index}
                    className={`relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 ${
                      plan.popular
                        ? "border-blue-200 ring-2 ring-blue-100"
                        : "border-emerald-100"
                    } ${
                      isCurrentPlan
                        ? "ring-2 ring-emerald-200 border-emerald-200"
                        : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {isCurrentPlan && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Current
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} mb-4`}
                      >
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline justify-center">
                        <span
                          className={`text-3xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
                        >
                          ${plan.price}
                        </span>
                        <span className="text-slate-500 text-sm ml-1">
                          {plan.price === 0 ? "forever" : "/month"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          <div
                            className={`flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-sm text-slate-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full ${
                        isCurrentPlan
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed"
                          : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`
                      }`}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan
                        ? "Current Plan"
                        : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
}
