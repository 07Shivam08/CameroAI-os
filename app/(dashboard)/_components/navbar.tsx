"use client";

import { NavbarRoutes } from "./navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`p-4 h-full flex items-center bg-[#FBF8FF] border-r`}>
      {isMobile ? (
        <MobileSidebar />
      ) : (
        <div className="hidden md:block mr-4">
          <SidebarTrigger className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg p-2 transition-all duration-200" />
        </div>
      )}
      <NavbarRoutes />
    </div>
  );
};
