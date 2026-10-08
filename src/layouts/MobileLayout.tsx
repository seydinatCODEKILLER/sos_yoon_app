import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, MoreHorizontal, User } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getNavItems, profilPathByRole, type NavBadge, type NavItem } from "@/config/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useNavBadges } from "@/shared/hooks/useNavBadges";
import { getActiveNavPath } from "@/shared/lib/getActiveNavPath";
import type { UserRole } from "@/types/user.types";

function TabBadge({ badge, value }: { badge?: NavBadge; value?: number }) {
  if (!badge || badge.kind === "label") return null;
  if (badge.kind === "count") {
    if (!value) return null;
    return (
      <span className="absolute -right-2 -top-1 min-w-4 rounded-full bg-signal px-1 text-center text-[9px] font-semibold leading-4 text-paper">
        {value}
      </span>
    );
  }
  if (!(badge.key && value)) return null;
  return <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-signal" />;
}

export function MobileLayout({ role, children }: { role: UserRole; children: ReactNode }) {
  const { pathname } = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const badges = useNavBadges(role);

  const items = getNavItems(role);
  const tabs = items.filter((i) => i.mobile);
  const profil = profilPathByRole[role];
  const extra: NavItem[] = items.some((i) => i.path === profil)
    ? []
    : [{ label: "Mon profil", path: profil, icon: User }];
  const overflow = [...items.filter((i) => !i.mobile), ...extra];

  const activePath = getActiveNavPath([...items, ...extra], pathname);
  const isOverflowActive = overflow.some((i) => i.path === activePath);

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 flex border-t border-paper/10 bg-ink px-2 pt-1.5"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {tabs.map(({ label, shortLabel, path, icon: Icon, badge }) => {
          const isActive = path === activePath;
          return (
            <Link
              key={path}
              to={path}
              className="group flex flex-1 flex-col items-center gap-0.5 py-1 outline-none"
            >
              <span
                className={`flex h-8 w-11 items-center justify-center rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-signal group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink ${
                  isActive ? "bg-signal/15" : ""
                }`}
              >
                <span className="relative">
                  <Icon
                    className={`h-5 w-5 transition-colors ${isActive ? "text-signal" : "text-paper/50"}`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  <TabBadge
                    badge={badge}
                    value={badge && "key" in badge && badge.key ? badges[badge.key] : undefined}
                  />
                </span>
              </span>
              <span
                className={`max-w-18 truncate text-[10px] leading-tight transition-colors ${
                  isActive ? "font-medium text-signal" : "text-paper/50"
                }`}
              >
                {shortLabel ?? label}
              </span>
            </Link>
          );
        })}

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
            <span className={`text-[10px] leading-tight ${isOverflowActive ? "font-medium text-signal" : "text-paper/50"}`}>
              Plus
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="mb-2 min-w-48">
            {overflow.map(({ label, path, icon: Icon }) => (
              <DropdownMenuItem key={path} render={<Link to={path} />}>
                <Icon className="h-4 w-4" />
                {label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}