"use client";

import {
  BarChart,
  BotIcon,
  Building2,
  Clock,
  Compass,
  DollarSignIcon,
  Layout,
  Settings,
  Trophy,
  User,
  UserPlus,
  Users,
  Zap,
  Brain,
  Database,
  Shield,
  Rocket,
} from "lucide-react";

import { SidebarItem } from "./sidebar-item";
import { useSidebar } from "@/components/ui/sidebar";
import { FaCodepen } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { useNavbarStore } from "./layoutWrapper";

var guestRoutes = [
  {
    icon: IoChatboxOutline,
    label: "AI Assistant",
    href: "/chat",
  },
  {
    icon: Zap,
    label: "Integrations",
    href: "/intrigation",
  },
];

var adminRoute = [
  {
    icon: IoChatboxOutline,
    label: "AI Command Center",
    href: "/chat",
  },
  {
    icon: Database,
    label: "Knowledge Vault",
    href: "/admin/enterprise",
  },
  {
    icon: Brain,
    label: "Neural Training",
    href: "/admin/knowForm",
  },
  {
    icon: Zap,
    label: "Integration Hub",
    href: "/intrigation",
  },
  {
    icon: Shield,
    label: "User Control",
    href: "/admin/users",
  },
  {
    icon: Building2,
    label: "Branch Management",
    href: "/admin/branches",
  },
  {
    icon: DollarSignIcon,
    label: "Financial Center",
    href: "/admin/biling",
  },
];

var superAdminRoute = [
  {
    icon: Clock,
    label: "Pending Organizations",
    href: "/sa/pending",
  },
  {
    icon: Building2,
    label: "Active Organizations",
    href: "/sa/onboarded",
  },
];

const customerRoute = [
  {
    icon: BarChart,
    label: "Customer Portal",
    href: "/customer",
  },
];

export const SidebarRoutes = () => {
  const { user } = useNavbarStore();
  const { open } = useSidebar();

  if (user?.role == "USER" && user.organizationId != null) {
    guestRoutes = guestRoutes.filter((route) => route.label != "Organization");
  }

  var routes: { icon: any; label: string; href: string }[];

  (() => {
    if (user) {
      switch (user.role) {
        case "ADMIN":
          return (routes = adminRoute);
        case "USER":
          return (routes = guestRoutes);
        case "SA":
          return (routes = superAdminRoute);
        default:
          return (routes = customerRoute);
      }
    } else {
      return (routes = guestRoutes);
    }
  })();

  return (
    <div className="flex h-full justify-between flex-col px-2">
      <div className="flex flex-col space-y-1">
        {/* Main Navigation */}
        <div className="mb-4">
          {open && (
            <div className="px-4 py-2 mb-3 relative z-50">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider text-shadow-sm">
                Navigation
              </h3>
            </div>
          )}
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
              isOpen={open}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
