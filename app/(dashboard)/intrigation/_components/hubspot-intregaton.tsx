"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHubspotAuthURL } from "./_utils/auth-urls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tverified } from "@/actions/get-user-privatedata";
import {
  Database,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";

export default function HubspotIntegration({
  verified,
}: {
  verified: Tverified;
}) {
  const handleAuth = async () => {
    window.location.href = await getHubspotAuthURL();
  };

  return (
    <Card className="border-2 border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-800">
                HubSpot Integration
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Connect your CRM and marketing hub
              </p>
            </div>
          </div>
          {!verified.hasHubspot && (
            <Button
              onClick={handleAuth}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              Authorize HubSpot
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CRM Integration Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:border-orange-300 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800">CRM Integration</h3>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {verified.hasHubspot ? (
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
              {verified.hasHubspot
                ? "Your HubSpot CRM is connected and syncing customer data."
                : "Connect HubSpot to manage customer relationships and track interactions."}
            </p>
          </div>

          {/* Analytics Integration Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:border-orange-300 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800">Marketing Hub</h3>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {verified.hasHubspot ? (
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
              {verified.hasHubspot
                ? "Marketing automation and analytics are active."
                : "Connect to enable marketing automation and detailed analytics."}
            </p>
          </div>
        </div>

        {verified.hasHubspot && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">HubSpot Integration Active</span>
            </div>
            <p className="text-sm text-emerald-600">
              Your CRM data is syncing in real-time. Marketing automation and
              customer insights are now available.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
