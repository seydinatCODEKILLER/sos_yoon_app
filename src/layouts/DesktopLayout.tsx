import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import type { NavItem } from "@/config/navigation";
import { AppSidebar } from "./AppSidebar";

interface DesktopLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
  /** Titre de la page courante, affiché dans le header */
  title?: string;
  /** Actions optionnelles (bouton, notifications, etc.) alignées à droite du header */
  headerActions?: ReactNode;
}

export function DesktopLayout({
  navItems,
  children,
  title,
  headerActions,
}: DesktopLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar navItems={navItems} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/60 bg-paper/80 px-4 backdrop-blur supports-backdrop-filter:bg-paper/60">
          <SidebarTrigger className="text-foreground/60 hover:text-foreground" />

          {title && (
            <>
              <Separator orientation="vertical" className="h-5" />
              <h1 className="truncate text-sm font-medium text-foreground/80">
                {title}
              </h1>
            </>
          )}

          {headerActions && (
            <div className="ml-auto flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </header>
        <main className="flex-1 overflow-y-auto bg-paper">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}