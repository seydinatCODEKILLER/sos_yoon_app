import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import type { NavItem } from "@/config/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface MobileLayoutProps {
  navItems: NavItem[];
  children: ReactNode;
}

const MAX_TABS = 4;

export function MobileLayout({ navItems, children }: MobileLayoutProps) {
  const location = useLocation();
  const hasOverflow = navItems.length > MAX_TABS;

  const visibleItems = hasOverflow ? navItems.slice(0, MAX_TABS - 1) : navItems;
  const overflowItems = hasOverflow ? navItems.slice(MAX_TABS - 1) : [];
  const isOverflowActive = overflowItems.some(
    (i) => i.path === location.pathname,
  );

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 flex border-t border-paper/10 bg-ink px-2 pt-1.5"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {visibleItems.map(({ label, shortLabel, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className="group flex flex-1 flex-col items-center gap-0.5 py-1 outline-none"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-11 items-center justify-center rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-signal group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink ${
                    isActive ? "bg-signal/15" : ""
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${isActive ? "text-signal" : "text-paper/50"}`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                </span>
                <span
                  className={`max-w-18 truncate text-[10px] leading-tight transition-colors ${isActive ? "font-medium text-signal" : "text-paper/50"}`}
                >
                  {shortLabel ?? label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {hasOverflow && (
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex flex-1 flex-col items-center gap-0.5 py-1 outline-none">
              <span
                className={`flex h-8 w-11 items-center justify-center rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-signal group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink data-popup-open:ring-2 data-popup-open:ring-signal data-popup-open:ring-offset-2 data-popup-open:ring-offset-ink ${
                  isOverflowActive ? "bg-signal/15" : ""
                }`}
              >
                <MoreHorizontal
                  className={`h-5 w-5 ${isOverflowActive ? "text-signal" : "text-paper/50"}`}
                  strokeWidth={isOverflowActive ? 2.25 : 1.75}
                />
              </span>
              <span
                className={`text-[10px] leading-tight ${isOverflowActive ? "font-medium text-signal" : "text-paper/50"}`}
              >
                Plus
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="mb-2">
              {overflowItems.map(({ label, path, icon: Icon }) => (
                <DropdownMenuItem key={path} render={<NavLink to={path} end />}>
                  <Icon className="h-4 w-4" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
    </div>
  );
}
