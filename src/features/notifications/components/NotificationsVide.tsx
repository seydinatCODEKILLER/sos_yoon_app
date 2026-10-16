import { Bell } from "lucide-react";

interface NotificationsVideProps {
  titre?: string;
  message?: string;
}

export function NotificationsVide({
  titre = "Aucune notification pour le moment.",
  message = "Vous serez prévenu ici dès qu'il y a du nouveau sur vos demandes.",
}: NotificationsVideProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
      <span
        aria-hidden
        className="grid size-24 place-items-center rounded-full bg-ink/4 text-navy"
      >
        <Bell className="size-9" strokeWidth={1.5} />
      </span>
      <h3 className="mt-8 max-w-xs text-balance text-[22px] leading-tight font-bold text-navy">
        {titre}
      </h3>
      <p className="mt-2 max-w-xs text-[15px] leading-snug text-ink/60">
        {message}
      </p>
    </div>
  );
}