import type { User } from "@/types/user.types";
import { ROLE_LABELS } from "../lib/roleLabels";
import { CheckCircle2 } from "lucide-react";

interface ProfileHeaderCardProps {
  user: User;
}

function getInitials(prenom: string, nom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();
}

export function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      {/* bannière décorative, sans contenu dessus */}
      <div className="relative h-14 bg-ink">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="pointer-events-none absolute -top-8 right-0 h-24 w-24 rounded-full bg-signal/25 blur-[50px]" />
      </div>

      <div className="flex flex-col items-center px-6 pb-6 pt-5 text-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg text-paper">
          {getInitials(user.prenom, user.nom)}
        </div>

        <div className="mt-3 min-w-0">
          <p className="truncate text-base font-medium text-ink">
            {user.prenom} {user.nom}
          </p>
          <div className="mt-0.5 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span className="truncate">{user.email}</span>
            <CheckCircle2 size={13} className="shrink-0 text-signal" />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-signal/15 px-2 py-0.5 text-[11px] font-medium text-signal">
              {ROLE_LABELS[user.role]}
            </span>
            {user.createdAt && (
              <span className="text-[11px] text-muted-foreground">
                Membre depuis{" "}
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {user.telephone && (
          <div className="mt-4 flex w-full items-center justify-between border-t border-border pt-3.5 text-sm">
            <span className="text-muted-foreground">Téléphone</span>
            <span className="text-ink">{user.telephone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
