import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, MoreHorizontal, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  getNavItems,
  profilPathByRole,
  type NavBadge,
  type NavItem,
} from "@/config/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useNavBadges } from "@/shared/hooks/useNavBadges";
import { getActiveNavPath } from "@/shared/lib/getActiveNavPath";
import type { UserRole } from "@/types/user.types";

function TabBadge({ badge, value }: { badge?: NavBadge; value?: number }) {
  if (!badge || badge.kind === "label") return null;
  if (badge.kind === "count") {
    if (!value) return null;
    return (
      <span className="absolute -top-2 -right-3 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-signal px-1 text-[10px] leading-none font-bold text-paper">
        {value > 99 ? "99+" : value}
      </span>
    );
  }
  if (!(badge.key && value)) return null;
  return (
    <span className="absolute -top-0.5 -right-1 size-2.5 rounded-full bg-signal" />
  );
}

function MobileHeader({ role }: { role: UserRole }) {
  const user = useAuthStore((s) => s.user);
  const initials =
    `${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}`.toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-paper/90 px-5 backdrop-blur">
      <Link to="/" aria-label="SOS Yoon, accueil" className="flex items-center">
        <img
          src="/images/logo_orange.png"
          alt="SOS Yoon"
          className="h-6 w-auto"
        />
      </Link>
      <Link
        to={profilPathByRole[role]}
        aria-label="Mon profil"
        className="grid size-9 place-items-center overflow-hidden rounded-full bg-navy text-xs font-semibold text-paper ring-2 ring-white"
      >
        {user?.photoUrl ? (
          <img src={user.photoUrl} alt="" className="size-full object-cover" />
        ) : initials ? (
          initials
        ) : (
          <User className="size-4" />
        )}
      </Link>
    </header>
  );
}

export function MobileLayout({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
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
  const showMore = overflow.length > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <MobileHeader role={role} />
      <main className="flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 flex bg-navy"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {tabs.map(({ label, shortLabel, path, icon: Icon, badge }) => {
          const isActive = path === activePath;
          return (
            <Link
              key={path}
              to={path}
              aria-current={isActive ? "page" : undefined}
              className="group relative flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 pt-1.5 outline-none focus-visible:bg-white/10"
            >
              {/* Trait orange de l'onglet actif (espace toujours réservé) */}
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 transition-colors ${
                  isActive ? "bg-signal" : "bg-transparent"
                }`}
              />
              <span className="relative">
                <Icon
                  className={`size-6 transition-colors ${
                    isActive ? "text-paper" : "text-paper/65"
                  }`}
                  strokeWidth={isActive ? 2.25 : 2}
                />
                <TabBadge
                  badge={badge}
                  value={
                    badge && "key" in badge && badge.key
                      ? badges[badge.key]
                      : undefined
                  }
                />
              </span>
              <span
                className={`text-xs leading-none font-semibold whitespace-nowrap transition-colors ${
                  isActive ? "text-paper" : "text-paper/65"
                }`}
              >
                {shortLabel ?? label}
              </span>
            </Link>
          );
        })}

        {showMore && (
          <DropdownMenu>
            <DropdownMenuTrigger className="group relative flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 pt-1.5 outline-none focus-visible:bg-white/10 data-popup-open:bg-white/10">
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 transition-colors ${
                  isOverflowActive ? "bg-signal" : "bg-transparent"
                }`}
              />
              <MoreHorizontal
                className={`size-6 transition-colors ${
                  isOverflowActive ? "text-paper" : "text-paper/65"
                }`}
                strokeWidth={isOverflowActive ? 2.25 : 2}
              />
              <span
                className={`text-xs leading-none font-semibold ${
                  isOverflowActive ? "text-paper" : "text-paper/65"
                }`}
              >
                Plus
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="mb-2 min-w-48"
            >
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
        )}
      </nav>
    </div>
  );
}