"use client";

import { RouteGuard } from "@/components/route-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={["ADMIN", "SA"]}>{children}</RouteGuard>;
}
