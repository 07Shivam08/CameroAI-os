"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getJiraAuthURL } from "./_utils/auth-urls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tverified } from "@/actions/get-user-privatedata";
import { Ticket, CheckCircle, AlertCircle, Zap, Settings } from "lucide-react";

export default function JiraIntegration({ verified }: { verified: Tverified }) {
  const handleAuth = async () => {
    window.location.href = await getJiraAuthURL();
  };

  return (
    <Card className="border-2 border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-800">
                Jira Integration
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Connect your Jira workspace
              </p>
            </div>
          </div>
          {!verified.hasJira && (
            <Button
              onClick={handleAuth}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              Authorize Jira
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Jira Workspace Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800">Jira Workspace</h3>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {verified.hasJira ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-sm">
                    Connected
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <Badge
                    variant="destructive"
                    className="bg-gradient-to-r from-red-500 to-red-600 border-0 shadow-sm"
                  >
                    Not Connected
                  </Badge>
                </>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {verified.hasJira
                ? "Your Jira account is connected and ready to manage tickets and workflows."
                : "Connect Jira to manage your organization's project workflows and track issues."}
            </p>

            {verified.hasJira && (
              <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Integration Active
                  </span>
                </div>
                <p className="text-xs text-emerald-600 mt-1">
                  Syncing tickets and project data in real-time
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
