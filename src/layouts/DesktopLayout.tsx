import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import type { NavItem } from "@/config/navigation";
import { AppSidebar } from "./AppSidebar";

interface DesktopLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
}

export function DesktopLayout({ navItems, children }: DesktopLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar navItems={navItems} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-y-auto bg-paper">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
