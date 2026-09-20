"use client";

import { RouteGuard } from "@/components/route-guard";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={["SA"]}>{children}</RouteGuard>;
}
