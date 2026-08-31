import { NavLink, useLocation } from "react-router-dom";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import type { NavItem } from "@/config/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface AppSidebarProps {
  navItems: NavItem[];
}

function getInitials(prenom: string, nom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();
}

export function AppSidebar({ navItems }: AppSidebarProps) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-12 items-center justify-center px-2 group-data-[collapsible=icon]:px-0">
          {/* Logo complet — masqué en mode réduit */}
          <span className="font-display text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            SOS Yoon
          </span>
          {/* Version compacte — visible uniquement en mode réduit */}
          <span className="hidden size-8 shrink-0 items-center justify-center rounded-md bg-signal font-display text-sm font-semibold text-ink group-data-[collapsible=icon]:flex">
            SY
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, path, icon: Icon }) => (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton
                    render={<NavLink to={path} end />}
                    isActive={location.pathname === path}
                    tooltip={label}
                    className="text-sidebar-foreground/70 hover:bg-signal/15 hover:text-signal data-[active=true]:bg-signal data-[active=true]:font-medium data-[active=true]:text-ink"
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="text-sidebar-foreground hover:bg-sidebar-accent data-popup-open:bg-sidebar-accent"
                  />
                }
              >
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarFallback className="rounded-md bg-signal font-medium text-ink">
                    {user ? getInitials(user.prenom, user.nom) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">
                    {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user?.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm font-medium">
                        {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem render={<NavLink to="/app/profil" />}>
                    <User />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings />
                    Paramètres
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => logout()}
                >
                  <LogOut />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
