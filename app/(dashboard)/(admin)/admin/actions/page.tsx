"use client";

import { AdminOnly } from "@/lib/role-guard";
import React, { useState } from "react";
import {
  Calendar,
  UserPlus,
  FileText,
  HelpCircle,
  Mail,
  ArrowRight,
  Zap,
  Filter,
  Rocket,
  Activity,
  Settings,
  Sparkles,
} from "lucide-react";

interface Action {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "all" | "hr" | "it" | "admin";
  color: string;
  bgColor: string;
}

const Actions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "hr" | "it" | "admin"
  >("all");

  const actions: Action[] = [
    {
      id: "leave-balance",
      title: "Fetch Leave Balance from HR System",
      description:
        "Instantly retrieve an employee's available leaves from the connected HRMS.",
      icon: Calendar,
      category: "hr",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "provision-access",
      title: "Provision Software Access for New Joiner",
      description:
        "Automatically grant access to tools like Slack, Google Workspace, and Jira.",
      icon: UserPlus,
      category: "it",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "purchase-order",
      title: "Create Purchase Order in ERP",
      description:
        "Draft a PO in SAP or Zoho Books, notify vendors, and log the request for approval.",
      icon: FileText,
      category: "admin",
      color: "text-emerald-950",
      bgColor: "bg-emerald-50",
    },
    {
      id: "it-ticket",
      title: "Raise IT Support Ticket",
      description:
        "Capture software issues and raise a ticket in Jira or Freshservice.",
      icon: HelpCircle,
      category: "it",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "email-group",
      title: "Add User to Email Group",
      description:
        "Add yourself or another employee to a distribution list using directory integration.",
      icon: Mail,
      category: "admin",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const categories = [
    { id: "all", name: "All Actions", count: actions.length },
    {
      id: "hr",
      name: "HR",
      count: actions.filter((a) => a.category === "hr").length,
    },
    {
      id: "it",
      name: "IT",
      count: actions.filter((a) => a.category === "it").length,
    },
    {
      id: "admin",
      name: "Admin",
      count: actions.filter((a) => a.category === "admin").length,
    },
  ];

  const filteredActions =
    selectedCategory === "all"
      ? actions
      : actions.filter((action) => action.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl mb-6 shadow-2xl">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Camero Actions
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              Experience Camero AI's Autonomous Agent through enterprise-grade
              automations that streamline your daily workflows
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Actions
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {actions.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-slate-500">Ready to use</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Active Integrations
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">24</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-slate-500">Connected services</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Automation Rate
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">98%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-slate-500">Success rate</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Time Saved</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">47h</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-slate-500">This month</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">
                Filter by department:
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category.name}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      selectedCategory === category.id
                        ? "bg-emerald-500"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">
                Available Actions
              </h2>
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                {filteredActions.length}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <div
                    key={action.id}
                    className="group bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                  >
                    {/* Icon and Category Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`w-7 h-7 ${action.color}`} />
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wide">
                        {categories.find((c) => c.id === action.category)?.name}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 mb-3 leading-tight group-hover:text-emerald-600 transition-colors">
                      {action.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      {action.description}
                    </p>

                    {/* CTA Button */}
                    <button className="group/btn w-full flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg">
                      <span>Try Action</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredActions.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No actions found
                </h3>
                <p className="text-slate-500">
                  Try selecting a different category to see available actions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Info Card */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Enterprise Automation at Scale
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                These pre-built actions demonstrate Camero AI's capability to
                automate common enterprise tasks. Each action integrates
                seamlessly with your existing systems and can be customized to
                match your specific business processes and requirements.
              </p>
              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Secure Integration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Real-time Processing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                  <span>Custom Workflows</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;
