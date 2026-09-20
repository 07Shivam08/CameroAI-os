"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNavbarStore } from "@/app/(dashboard)/_components/layoutWrapper";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const RouteGuard = ({
  children,
  allowedRoles,
  redirectTo = "/chat",
}: RouteGuardProps) => {
  const { user } = useNavbarStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // User not loaded yet, wait
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      // User doesn't have permission, redirect
      router.push(redirectTo);
    }
  }, [user, allowedRoles, redirectTo, router]);

  // If user not loaded yet or doesn't have permission, don't render children
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
