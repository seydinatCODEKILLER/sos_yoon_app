import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, LogOut, MoreHorizontal, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/shared/components/ui/sheet";
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

const LIBELLE_ESPACE: Partial<Record<string, string>> = {
  PRO: "Espace praticien",
  PARTICULIER: "Espace citoyen",
  ADMIN: "Administration",
};

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

/** Badge affiché à droite d'une ligne de la feuille « Plus » */
function RowBadge({ badge, value }: { badge?: NavBadge; value?: number }) {
  if (!badge || badge.kind === "label" || !value) return null;
  if (badge.kind === "count") {
    return (
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-signal px-1.5 text-[11px] leading-none font-bold text-paper">
        {value > 99 ? "99+" : value}
      </span>
    );
  }
  return <span className="size-2.5 rounded-full bg-signal" aria-hidden />;
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
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const badges = useNavBadges(role);
  const [plusOuvert, setPlusOuvert] = useState(false);

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

  const initials =
    `${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}`.toUpperCase();
  const nomComplet = [user?.prenom, user?.nom].filter(Boolean).join(" ");

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
          <button
            type="button"
            onClick={() => setPlusOuvert(true)}
            aria-haspopup="dialog"
            aria-expanded={plusOuvert}
            className="group relative flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 pt-1.5 outline-none focus-visible:bg-white/10"
          >
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
          </button>
        )}
      </nav>

      {showMore && (
        <Sheet open={plusOuvert} onOpenChange={setPlusOuvert}>
          <SheetContent
            side="bottom"
            className="max-h-[85dvh] gap-0 overflow-y-auto rounded-t-3xl bg-paper p-0"
          >
            <SheetTitle className="sr-only">Plus d'options</SheetTitle>

            {/* Poignée */}
            <div
              aria-hidden
              className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-ink/15"
            />

            {/* Carte utilisateur */}
            <div className="flex items-center gap-3 px-5 pt-4 pb-3">
              <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-navy text-sm font-semibold text-paper">
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : initials ? (
                  initials
                ) : (
                  <User className="size-5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-ink">
                  {nomComplet || "Mon compte"}
                </p>
                <p className="text-xs text-ink/55">
                  {LIBELLE_ESPACE[role] ?? "SOS Yoon"}
                </p>
              </div>
            </div>

            {/* Liens */}
            <ul className="space-y-1 px-3 pb-2">
              {overflow.map(({ label, path, icon: Icon, badge }) => {
                const actif = path === activePath;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => setPlusOuvert(false)}
                      aria-current={actif ? "page" : undefined}
                      className={`flex min-h-14 items-center gap-3 rounded-2xl px-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal active:bg-ink/10 ${
                        actif ? "bg-signal/10" : "hover:bg-ink/5"
                      }`}
                    >
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                          actif
                            ? "bg-signal text-paper"
                            : "bg-navy/8 text-navy"
                        }`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <span
                        className={`flex-1 text-[15px] ${
                          actif
                            ? "font-bold text-ink"
                            : "font-medium text-ink/85"
                        }`}
                      >
                        {label}
                      </span>
                      <RowBadge
                        badge={badge}
                        value={
                          badge && "key" in badge && badge.key
                            ? badges[badge.key]
                            : undefined
                        }
                      />
                      <ChevronRight
                        className="size-4 shrink-0 text-ink/30"
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Déconnexion */}
            <div
              className="border-t border-ink/10 px-3 pt-2"
              style={{
                paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setPlusOuvert(false);
                  logout();
                }}
                className="flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-left outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-400 active:bg-red-100"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
                  <LogOut className="size-5" />
                </span>
                <span className="text-[15px] font-semibold text-red-600">
                  Déconnexion
                </span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}