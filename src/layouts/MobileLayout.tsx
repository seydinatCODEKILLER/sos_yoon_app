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
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 flex border-t border-ink/10 bg-ink text-paper">
        {tabItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-[11px] ${
                isActive ? "text-signal" : "text-paper/60"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}