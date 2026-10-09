import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { notificationsPathByRole, profilPathByRole } from "@/config/navigation";
import { useNavBadges } from "@/shared/hooks/useNavBadges";
import { getDisplayName, getInitials } from "@/shared/lib/userDisplay";
import type { UserRole } from "@/types/user.types";

export function HeaderActions({ role }: { role: UserRole }) {
  const user = useAuthStore((s) => s.user);
  const unread = useNavBadges(role).notifications ?? 0;
  const notifPath = notificationsPathByRole[role];

  return (
    <div className="ml-auto flex items-center gap-1 self-stretch border-l border-border/60 pl-3">
      {notifPath && (
        <Link
          to={notifPath}
          aria-label={unread ? `Notifications, ${unread} non lue(s)` : "Notifications"}
          className="relative flex size-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <Bell className="size-4.5" />
          {unread > 0 && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-signal ring-2 ring-paper" />
          )}
        </Link>
      )}
      <Link to={profilPathByRole[role]} aria-label="Mon profil" className="rounded-full">
        <Avatar className="size-8">
          {user?.photoUrl && <AvatarImage src={user.photoUrl} alt={getDisplayName(user)} />}
          <AvatarFallback className="bg-navy text-xs font-semibold text-paper">
            {getInitials(user)}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}