import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { sidebarThemes } from "@/config/sidebarThemes";
import { portalLabelByRole } from "@/config/navigation";
import type { UserRole } from "@/types/user.types";
import { AppSidebar } from "./AppSidebar";
import { HeaderActions } from "./HeaderActions";

interface DesktopLayoutProps {
  role: UserRole;
   section?: string; 
  title?: string;
  children: ReactNode;
}

export function DesktopLayout({ role, section, title, children }: DesktopLayoutProps) {
  return (
    <SidebarProvider style={sidebarThemes[role]}>
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/60 bg-paper/80 px-4 backdrop-blur supports-backdrop-filter:bg-paper/60">
          <SidebarTrigger className="text-foreground/60 hover:text-foreground" />
          <nav aria-label="Fil d'Ariane" className="flex min-w-0 items-center gap-2 text-sm">
            <span className="hidden text-ink/50 sm:inline">{section ?? portalLabelByRole[role]}</span>
            {title && (
              <>
                <span className="hidden text-ink/25 sm:inline">/</span>
                <h1 className="truncate font-medium text-ink">{title}</h1>
              </>
            )}
          </nav>
          <HeaderActions role={role} />
        </header>
        <main className="flex-1 overflow-y-auto bg-paper">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}