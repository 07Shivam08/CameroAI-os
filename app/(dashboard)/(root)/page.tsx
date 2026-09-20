"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useNavbarStore } from "../_components/layoutWrapper";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Users,
  BarChart,
  Settings,
  Sparkles,
  Database,
  Zap,
  TrendingUp,
  Bot,
  Shield,
  Brain,
} from "lucide-react";
import { UserAndAdminAccess } from "@/lib/role-guard";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useNavbarStore();

  // No automatic redirect - all users stay on the dashboard
  // useEffect(() => {
  //   if (user) {
  //     // Previously redirected USER role to /chat, now we allow them to stay
  //     // on dashboard but with limited view (controlled by UserAndAdminAccess component)
  //   }
  // }, [user, router]);

  return (
    <UserAndAdminAccess>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Welcome to Camero AI
              </h1>
              <p className="text-slate-600 mt-1">
                {user?.role === "USER"
                  ? "Your personal AI assistant"
                  : "Your intelligent enterprise assistant and automation platform"}
              </p>
            </div>
          </div>

          {/* Stats Cards - Only visible to admins */}
          {(user?.role === "ADMIN" || user?.role === "SA") && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      AI Conversations
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">47</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+23%</span>
                  <span className="text-slate-500 ml-1">this week</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Team Members
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">12</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-slate-500">Active organization</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Automations
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">8</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <Sparkles className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-slate-500">Running smoothly</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Knowledge Base
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">
                      156
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <Brain className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-slate-500">Documents trained</span>
                </div>
              </div>
            </div>
          )}

          {/* User-focused stats - Only visible to regular users */}
          {user?.role === "USER" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      My Conversations
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">-</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-slate-500">Recent activity</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      My Team
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">-</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-slate-500">Team members</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Available Integrations
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">-</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <Sparkles className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-slate-500">Connect your tools</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Chat Card - Always visible to all users */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-emerald-100 p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  AI Assistant
                </h2>
                <p className="text-sm text-slate-500">
                  Intelligent conversations
                </p>
              </div>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Start intelligent conversations with Camero AI to get help with
              your tasks, automate workflows, and boost productivity.
            </p>
            <Button
              onClick={() => router.push("/chat")}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chatting
            </Button>
          </div>

          {/* Organization Card - Only visible to admins */}
          {(user?.role === "ADMIN" || user?.role === "SA") && (
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-blue-100 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Organization
                  </h2>
                  <p className="text-sm text-slate-500">Team management</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Manage your organization settings, team members, roles, and
                access controls from one central location.
              </p>
              <Button
                onClick={() => router.push("/organisation")}
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                <Shield className="h-4 w-4 mr-2" />
                Manage Organization
              </Button>
            </div>
          )}

          {/* Analytics Card - Only visible to admins */}
          {(user?.role === "ADMIN" || user?.role === "SA") && (
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-purple-100 p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BarChart className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                    Analytics
                  </h2>
                  <p className="text-sm text-slate-500">Performance insights</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                View comprehensive insights and analytics about your team's
                performance, AI usage, and productivity metrics.
              </p>
              <Button
                onClick={() => router.push("/leaderboard")}
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              >
                <BarChart className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          )}

          {/* User-specific cards */}
          {user?.role === "USER" && (
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-blue-100 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Integrations
                  </h2>
                  <p className="text-sm text-slate-500">Connect your tools</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Connect Camero AI with your favorite tools and services to
                automate workflows and enhance productivity.
              </p>
              <Button
                onClick={() => router.push("/intrigation")}
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                <Zap className="h-4 w-4 mr-2" />
                Explore Integrations
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-white" />
              <h3 className="text-xl font-semibold text-white">
                Quick Actions
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              {/* New Chat Button - Always visible */}
              <Button
                onClick={() => router.push("/chat")}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                New Chat
              </Button>

              {/* Admin-only buttons */}
              {(user?.role === "ADMIN" || user?.role === "SA") && (
                <>
                  <Button
                    onClick={() => router.push("/admin/enterprise")}
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Knowledge Base
                  </Button>
                  <Button
                    onClick={() => router.push("/admin/users")}
                    variant="outline"
                    className="border-purple-200 hover:bg-purple-50"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </>
              )}

              {/* Integration button - Visible to all users */}
              <Button
                onClick={() => router.push("/intrigation")}
                variant="outline"
                className="border-orange-200 hover:bg-orange-50"
              >
                <Zap className="h-4 w-4 mr-2" />
                Integrations
              </Button>
            </div>
          </div>
        </div>
      </div>
    </UserAndAdminAccess>
  );
}
