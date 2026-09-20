"use client";

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Navbar } from "./navbar";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Tverified } from "@/actions/get-user-privatedata";
import { useIsMobile } from "@/hooks/use-mobile";
import { TUserContext } from "@/features/user/api/user";
import { getPlanWithExpiry, Plan } from "@/constant/plan";
import { SidebarProvider } from "@/components/ui/sidebar";

const Sidebar = dynamic(() => import("./sidebar"));

const NavbarStore = createContext<{
  rigntSideBarOpen: boolean;
  setRightSideBarOpen: Dispatch<SetStateAction<boolean>>;
  setPostCreating: Dispatch<SetStateAction<boolean>>;
  isCreatingPost: boolean;
  user: TUserContext["user"] | null;
  verified: Tverified;
  activeSubscription: TUserContext["activeSubscription"] | null;
  organization: TUserContext["organization"] | null;
  plan: Plan | undefined;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}>({
  rigntSideBarOpen: false,
  setRightSideBarOpen: () => undefined,
  isCreatingPost: false,
  setPostCreating: () => undefined,
  user: null,
  organization: null,
  activeSubscription: null,
  verified: {
    hasCalender: false,
    hasEmail: false,
    hasJira: false,
    hasHubspot: false,
  },
  plan: undefined,
  sidebarOpen: true,
  setSidebarOpen: () => undefined,
});

export const useNavbarStore = () => {
  return useContext(NavbarStore);
};

export default function LayoutWrapper({
  user,
  children,
  verified,
  activeSubscription,
  organization,
}: TUserContext & { children: React.ReactNode }) {
  const pathname = usePathname();
  const [rigntSideBarOpen, setRightSideBarOpen] = useState(false);
  const [isCreatingPost, setPostCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Update sidebar state based on page
  // Sidebar should be collapsed only when in chat pages
  useEffect(() => {
    // We only auto-collapse the sidebar on chat pages, but never make it disappear
    if (pathname?.includes("/chat")) {
      // Collapse the sidebar but don't hide it completely
      setSidebarOpen(false);
    } else {
      // Expand the sidebar on non-chat pages
      setSidebarOpen(true);
    }
  }, [pathname]);

  const plan = getPlanWithExpiry(
    activeSubscription?.plan,
    activeSubscription?.endDate!
  );

  // Check if current page is a chat page
  const isChatPage = pathname?.includes("/chat");

  return (
    <NavbarStore.Provider
      value={{
        verified,
        rigntSideBarOpen,
        user,
        // @ts-ignore
        activeSubscription,
        organization,
        plan,
        setRightSideBarOpen,
        setPostCreating,
        isCreatingPost,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      <SidebarProvider
        defaultOpen={sidebarOpen}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      >
        <div className="flex h-screen w-full overflow-hidden">
          {/* Sidebar - Always visible, but collapses on chat page */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex flex-col flex-1 h-full relative overflow-hidden">
            {/* Navbar - Hide on chat pages */}
            {!pathname?.includes("/chat") && (
              <div
                className={`w-full h-[80px] ${
                  pathname?.includes("teammeet") ? "hidden" : ""
                } z-50`}
              >
                <Navbar />
              </div>
            )}

            {/* Main Content Area */}
            <main className="overflow-y-auto flex-1 relative">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </NavbarStore.Provider>
  );
}
