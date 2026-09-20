import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGoogleAuthURL } from "./_utils/auth-urls";
import { Tverified } from "@/actions/get-user-privatedata";
import { Calendar, Mail, CheckCircle, AlertCircle, Zap } from "lucide-react";

export default function GoogleIntregation({
  verified,
}: {
  verified: Tverified;
}) {
  const handleAuth = async () => {
    window.location.href = await getGoogleAuthURL();
  };

  return (
    <Card className="border-2 border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <img
                src="/api/placeholder/24/24"
                alt="Google"
                className="w-6 h-6"
              />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-800">
                Google Integration
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Connect your Google services
              </p>
            </div>
          </div>
          {(!verified.hasCalender || !verified.hasEmail) && (
            <Button
              onClick={handleAuth}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              Authorize Google
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Calendar Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800">Google Calendar</h3>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {verified.hasCalender ? (
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
              {verified.hasCalender
                ? "Your Google Calendar is connected and ready to sync appointments."
                : "Connect your Google Calendar to manage appointments and schedule meetings."}
            </p>
          </div>

          {/* Gmail Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800">Gmail</h3>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {verified.hasEmail ? (
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
              {verified.hasEmail
                ? "Your Gmail account is connected and ready to send emails."
                : "Connect your Gmail to send emails and manage communications."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
