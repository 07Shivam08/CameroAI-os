import type { Metadata } from "next";

import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "Camero AI",
  description: "Enterprise AI Assistant",
  icons: {
    icon: "/CameroChatLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <QueryProvider>
            <SidebarProvider className="w-full">
              {/* <ConfettiProvider /> */}
              <ToastProvider />
              <div className="w-full bg-gradient-to-br from-emerald-50 to-green-50">
                {children}
              </div>
            </SidebarProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
