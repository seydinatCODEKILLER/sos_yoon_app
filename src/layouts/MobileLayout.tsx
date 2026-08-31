import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import type { NavItem } from "@/config/navigation";

interface MobileLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
}

const MAX_TABS = 4;

export function MobileLayout({ navItems, children }: MobileLayoutProps) {
  // Au-delà de 4 items (cas pro/admin plus tard), les items excédentaires
  // seront à regrouper derrière un onglet "Plus" — à traiter le moment venu.
  const tabItems = navItems.slice(0, MAX_TABS);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 flex border-t border-paper/10 bg-ink px-2 pt-1.5"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {tabItems.map(({ label, shortLabel, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className="flex flex-1 flex-col items-center gap-0.5 py-1"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-11 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-signal/15" : ""
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-signal" : "text-paper/50"
                    }`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                </span>
                <span
                  className={`max-w-18 truncate text-[10px] leading-tight transition-colors ${
                    isActive ? "font-medium text-signal" : "text-paper/50"
                  }`}
                >
                  {shortLabel ?? label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}