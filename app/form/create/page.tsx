export const dynamic = "force-dynamic";

import React from "react";
import CreateorgStateProvider from "./_component/CreateorgStateProvider";
import OrgFormhandeler from "./_component/OrgFormhandeler";

export default async function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <CreateorgStateProvider>
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <OrgFormhandeler />
        </div>
      </CreateorgStateProvider>
    </div>
  );
}
