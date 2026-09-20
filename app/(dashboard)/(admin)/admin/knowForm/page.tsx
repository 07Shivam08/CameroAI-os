"use client";
import React from "react";
import { AdminOnly } from "@/lib/role-guard";
import { Brain, Sparkles, Database, Zap } from "lucide-react";
import KnowledgeBaseForm from "./_components/edit-form-knowledge";
import EditKnowledge from "./_components/edit-knowlwdge";
import { useGetKnowledgebase } from "@/features/oragnization/api/knowledgebase";
import { useNavbarStore } from "@/app/(dashboard)/_components/layoutWrapper";

export default function page() {
  const { user } = useNavbarStore();
  const { data: knowledgeBase, isLoading } = useGetKnowledgebase(
    user!.organizationId!
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading neural training data...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 flex flex-col">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Neural Training Center
              </h1>
              <p className="text-slate-600 mt-1">
                Train your AI assistant with organizational knowledge and
                context
              </p>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  {knowledgeBase ? (
                    <Database className="h-6 w-6 text-white" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {knowledgeBase
                      ? "Knowledge Base Configured"
                      : "Setup Required"}
                  </h3>
                  <p className="text-slate-600">
                    {knowledgeBase
                      ? "Your AI assistant is trained with organizational data"
                      : "Configure your organization's knowledge base to enhance AI responses"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    knowledgeBase
                      ? "bg-green-400 animate-pulse"
                      : "bg-orange-400"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    knowledgeBase ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {knowledgeBase ? "Active" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg overflow-hidden flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">
                {knowledgeBase
                  ? "Update Knowledge Base"
                  : "Create Knowledge Base"}
              </h2>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            {knowledgeBase ? (
              <EditKnowledge
                orgId={user?.organizationId!}
                knowledge={knowledgeBase}
              />
            ) : (
              <KnowledgeBaseForm />
            )}
          </div>
        </div>
      </div>
    </AdminOnly>
  );
}
