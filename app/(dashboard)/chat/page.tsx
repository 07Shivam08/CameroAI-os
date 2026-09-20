"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  MessageCircle,
  Plus,
  Bot,
  Sparkles,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavbarStore } from "@/app/(dashboard)/_components/layoutWrapper";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: any[];
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setSidebarOpen } = useNavbarStore();

  // Always ensure the sidebar is visible on the main chat listing page
  useEffect(() => {
    setSidebarOpen(true);
  }, [setSidebarOpen]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats");
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "New Chat" }),
      });

      if (response.ok) {
        const newChat = await response.json();
        router.push(`/chat/${newChat.id}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setChats(chats.filter((chat) => chat.id !== chatId));
        toast.success("Chat deleted successfully");
      } else {
        toast.error("Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"></div>
          <div
            className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <span className="ml-2 text-slate-600">
            Loading your conversations...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                AI Conversations
              </h1>
              <p className="text-slate-600 mt-1">
                Start intelligent conversations with Camero AI
              </p>
            </div>
          </div>

          <Button
            onClick={createNewChat}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Chats
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {chats.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-slate-500">Active conversations</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  AI Responses
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {chats.reduce(
                    (total, chat) => total + chat.messages.length,
                    0
                  )}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <Bot className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Sparkles className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-slate-500">Smart assistance</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Quick Actions
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">8</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Clock className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-slate-500">Available now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-4">
        {chats.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Recent Conversations
            </h2>
            <div className="grid gap-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-slate-200 p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                          {chat.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {chat.messages.length} messages •{" "}
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300 p-12">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No conversations yet
              </h3>
              <p className="text-slate-500 mb-6">
                Start your first conversation with Camero AI to get help with
                tasks, automate workflows, and boost your productivity.
              </p>
              <Button
                onClick={createNewChat}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Start Your First Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
