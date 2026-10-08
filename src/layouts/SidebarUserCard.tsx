import { Link } from "react-router-dom";
import { ChevronRight, LogOut, Settings, ShieldCheck, User } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shared/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { profilPathByRole } from "@/config/navigation";
import { getDisplayName, getInitials } from "@/shared/lib/userDisplay";
import type { UserRole } from "@/types/user.types";

function Subtitle({ role, verified }: { role: UserRole; verified: boolean }) {
  if (role === "PARTICULIER") {
    return verified ? (
      <span className="flex items-center gap-1 text-xs text-emerald-400">
        <ShieldCheck className="size-3" /> Compte vérifié
      </span>
    ) : (
      <span className="text-xs opacity-60">Compte non vérifié</span>
    );
  }
  // TODO : afficher le métier (Avocat, Notaire…) quand le profil pro sera chargé
  return (
    <span className="text-xs opacity-60">
      {role === "ADMIN" ? "Admin" : "Professionnel"}
    </span>
  );
}

export function SidebarUserCard({ role }: { role: UserRole }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const name = getDisplayName(user);

  return (
    <SidebarMenu>
      {role === "PRO" && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => logout()}
            tooltip="Déconnexion"
            className="text-(--nav-muted) hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut />
            <span>Déconnexion</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="bg-(--nav-card-bg) text-(--nav-card-fg) hover:bg-(--nav-card-bg) hover:text-(--nav-card-fg) hover:opacity-90 data-popup-open:bg-(--nav-card-bg)"
              />
            }
          >
            <div className="relative">
              <Avatar className="size-8">
                {user?.photoUrl && <AvatarImage src={user.photoUrl} alt={name} />}
                <AvatarFallback className="bg-signal text-xs font-semibold text-paper">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-(--nav-card-bg) bg-emerald-500" />
            </div>
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-medium">{name}</span>
              <Subtitle role={role} verified={!!user?.telephoneVerifie} />
            </div>
            <ChevronRight className="ml-auto size-4 opacity-50 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email ?? user?.telephone}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link to={profilPathByRole[role]} />}>
                {role === "ADMIN" ? <Settings /> : <User />}
                {role === "ADMIN" ? "Paramètres" : "Mon profil"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => logout()}>
              <LogOut />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}