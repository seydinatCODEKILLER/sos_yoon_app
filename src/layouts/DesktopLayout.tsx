import type { ReactNode } from "react";
import type { NavItem } from "@/config/navigation";
import { Sidebar } from "./Sidebar";

interface DesktopLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
}

export function DesktopLayout({ navItems, children }: DesktopLayoutProps) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar navItems={navItems} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
