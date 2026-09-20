"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SidebarRoutes } from "./sidebar-routes";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bot, Sparkles } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

const Sidebar = () => {
  const { open, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  // We've moved the auto-collapse logic to the layoutWrapper.tsx
  // This ensures consistent sidebar behavior across the app

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div
      className={`h-full z-[99999] flex flex-col bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 border-r border-emerald-700/30 shadow-2xl transition-all duration-300 ${
        open ? "w-64" : "w-20" // Increased collapsed sidebar width from 16 to 20
      }`}
      style={{
        isolation: "isolate",
        position: "relative",
      }} /* Add CSS isolation and position for better z-index handling */
    >
      {/* Header Section */}
      <div className="flex justify-center items-center py-6 px-4 border-b border-emerald-700/30">
        {open || isMobile ? (
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className="relative">
              <Image
                src="/CameroLogo.jpg"
                alt="Camero AI"
                width={40}
                height={40}
                className="rounded-xl shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white tracking-tight text-shadow relative z-50">
                Camero AI
              </h1>
              <p className="text-xs text-emerald-300 font-medium text-shadow-sm relative z-50">
                Enterprise Assistant
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative cursor-pointer hover:scale-105 transition-transform"
              onClick={handleLogoClick}
            >
              <Image
                src="/CameroChatLogo.png"
                alt="Camero AI"
                width={32}
                height={32}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            </div>
            <SidebarTrigger className="text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-lg p-2 transition-all duration-200" />
          </div>
        )}
      </div>

      {/* Navigation Routes */}
      <div className="flex flex-col flex-1 overflow-y-auto py-4 scrollbar-hide">
        <SidebarRoutes />
      </div>

      {/* Footer Section */}
      {open && (
        <div className="border-t border-emerald-700/30 p-4 mt-auto">
          <div className="bg-gradient-to-r from-emerald-800/50 to-emerald-700/50 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-200 font-medium">
                System Active
              </span>
            </div>
            <p className="text-xs text-emerald-300">
              Powered by{" "}
              <span className="text-emerald-200 font-semibold">Camero AI</span>
            </p>
            <p className="text-[10px] text-emerald-400 mt-1">v2.0 Enterprise</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
