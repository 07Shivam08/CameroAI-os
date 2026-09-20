"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isOpen: boolean;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isOpen,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer transition-all duration-300 ease-in-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        isOpen ? "mx-3 mb-2" : "mx-2 mb-2" // Increased horizontal margin for better spacing in collapsed state
      )}
    >
      <div
        className={cn(
          "flex items-center transition-all duration-300 relative",
          "text-emerald-200 text-sm font-medium",
          "hover:bg-emerald-800/40 hover:text-white hover:shadow-lg hover:shadow-emerald-900/20",
          "border border-transparent hover:border-emerald-600/30",
          "backdrop-blur-sm",
          isOpen
            ? "gap-x-3 px-4 py-3.5 rounded-xl"
            : "justify-center px-5 py-4 rounded-lg", // Increased padding for better spacing in collapsed state
          isActive && [
            "bg-gradient-to-r from-emerald-600/40 to-emerald-700/40",
            "text-white shadow-lg shadow-emerald-900/30",
            "border-emerald-500/50",
            "backdrop-blur-md",
          ]
        )}
      >
        {/* Animated background on hover */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
            "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20",
            "group-hover:opacity-100 z-0" // Lower z-index to ensure it's below the content
          )}
        />

        {/* Active indicator line */}
        {isOpen ? (
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300",
              "bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-400/50",
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
          />
        ) : (
          // Enhanced visible indicator when sidebar is collapsed and item is active
          isActive && (
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-3.5 rounded-r-full transition-all duration-300", // Increased width from 2.5 to 3.5
                "bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-400/50"
              )}
            />
          )
        )}

        <div
          className={cn(
            "relative z-20 flex items-center w-full", // Increased z-index from 10 to 20
            isOpen ? "gap-x-3" : "justify-center"
          )}
        >
          <ActionTooltip
            isOpen={isOpen}
            side="right"
            align="center"
            label={label}
          >
            <div
              className={cn(
                "transition-all duration-300 flex items-center justify-center",
                isOpen
                  ? "p-2 rounded-lg bg-emerald-700/30 group-hover:bg-emerald-600/40"
                  : "p-1.5 rounded-md",
                isActive &&
                  (isOpen ? "bg-emerald-600/50 shadow-md" : "bg-emerald-600/30")
              )}
            >
              <Icon
                className={cn(
                  "transition-all duration-300",
                  isOpen ? "h-5 w-5" : "h-4 w-4",
                  "group-hover:scale-110",
                  isActive && "text-emerald-200 scale-110"
                )}
              />
            </div>
          </ActionTooltip>

          {isOpen && (
            <div className="flex-1 flex items-center justify-between z-50 relative">
              <span
                className={cn(
                  "truncate transition-all duration-300 sidebar-text",
                  "group-hover:translate-x-1",
                  "text-emerald-100",
                  isActive && "font-semibold text-white"
                )}
              >
                {label}
              </span>
              {isActive && (
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              )}
            </div>
          )}
        </div>

        {/* Hover glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
            "bg-gradient-to-r from-emerald-600/10 to-emerald-500/10",
            "group-hover:opacity-100 z-0" // Lower z-index to ensure it's below the content
          )}
        />
      </div>
    </div>
  );
};
