import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import type { NavItem } from "@/config/navigation";
import { UserMenu } from "@/shared/components/UserMenu";

interface UserTopbarLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
}

export function UserTopbarLayout({ navItems, children }: UserTopbarLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#F5F2ED]">
      <header className="sticky top-0 z-10 border-b border-ink/6 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-6">
          <span className="font-display text-base font-semibold text-ink">
            <span className="text-signal">SOS</span> Yoon
          </span>

          <nav className="ml-6 flex items-center gap-0.5 rounded-full bg-ink/4 p-1">
            {navItems.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                      : "text-ink/50 hover:text-ink/80"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto">
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}