import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export const MobileSidebar = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu className="text-emerald-600" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 border-emerald-700/30 w-64"
      >
        <SidebarProvider defaultOpen={true}>
          <Sidebar />
        </SidebarProvider>
      </SheetContent>
    </Sheet>
  );
};
