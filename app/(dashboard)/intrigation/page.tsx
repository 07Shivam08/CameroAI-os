"use client";
import React from "react";
import { Zap, Puzzle, Link2, Workflow } from "lucide-react";
import JiraIntregation from "./_components/jira-intregation";
import GoogleIntregation from "./_components/google-intrigation";
import HubspotIntegration from "./_components/hubspot-intregaton";
import { useNavbarStore } from "../_components/layoutWrapper";

export default function IntegrationPage() {
  const { verified } = useNavbarStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Integration Hub
            </h1>
            <p className="text-slate-600 mt-1">
              Connect your favorite tools and streamline your workflow
            </p>
          </div>
        </div>

        {/* Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Available Integrations
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">3</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Puzzle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-slate-500">Google, Jira, HubSpot</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Connected Services
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {verified ? "1+" : "0"}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <Link2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  verified ? "bg-green-400 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-slate-500">
                {verified ? "Active connections" : "Setup required"}
              </span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Automation Status
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {verified ? "Active" : "Pending"}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Workflow className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-slate-500">Workflow enhancement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="space-y-6">
        <GoogleIntregation verified={verified} />
        <JiraIntregation verified={verified} />
        <HubspotIntegration verified={verified} />
      </div>
    </div>
  );
}
