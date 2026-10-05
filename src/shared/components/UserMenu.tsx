import { NavLink } from "react-router-dom";
import { LogOut, User } from "lucide-react";
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
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getInitials } from "@/shared/lib/getInitials";

export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-ink/5 data-popup-open:bg-ink/5"
          />
        }
      >
        <Avatar className="h-8 w-8 rounded-full ring-1 ring-ink/6">
          <AvatarFallback className="rounded-full bg-ink/6 font-medium text-ink/70">
            {user ? getInitials(user.prenom, user.nom) : "?"}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium text-ink/80 sm:inline">
          {user ? user.prenom : "Utilisateur"}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-0.5">
              <span className="text-sm font-medium">
                {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.telephone}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<NavLink to="/app/profil" />}>
          <User />
          Mon profil
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={() => logout()}>
          <LogOut />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
