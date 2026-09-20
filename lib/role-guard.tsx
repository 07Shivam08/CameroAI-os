"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNavbarStore } from "@/app/(dashboard)/_components/layoutWrapper";
import { Role } from "@prisma/client";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
}

export const RoleGuard = ({
  children,
  allowedRoles,
  redirectTo = "/chat",
}: RoleGuardProps) => {
  const { user } = useNavbarStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role as Role)) {
      router.push(redirectTo);
    }
  }, [user, allowedRoles, redirectTo, router]);

  // Show loading or return null while checking
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"></div>
          <div
            className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <span className="ml-2 text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  // If user doesn't have permission, don't render children
  if (!allowedRoles.includes(user.role as Role)) {
    return null;
  }

  return <>{children}</>;
};

// Helper components for specific roles
export const AdminOnly = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard allowedRoles={[Role.ADMIN, Role.SA]}>{children}</RoleGuard>
);

export const SuperAdminOnly = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard allowedRoles={[Role.SA]}>{children}</RoleGuard>
);

export const UserOnly = ({ children }: { children: React.ReactNode }) => (
  <RoleGuard allowedRoles={[Role.USER]} redirectTo="/chat">
    {children}
  </RoleGuard>
);

export const UserAndAdminAccess = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <RoleGuard allowedRoles={[Role.USER, Role.ADMIN, Role.SA]}>
    {children}
  </RoleGuard>
);
