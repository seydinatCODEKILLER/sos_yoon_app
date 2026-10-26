import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { toast } from "@/shared/lib/toast";
import { useModifierPreferences } from "../hooks/usePreferencesNotifications";
import { profilRoutes } from "../lib/profilRoutes";
import type { PreferencesNotifications } from "../types/preferences.types";

// Passe à true quand l'API d'envoi de SMS existe
const SMS_DISPONIBLE = false;

interface LigneReglageProps {
  titre: string;
  description: string;
  actif: boolean;
  onChange?: (valeur: boolean) => void;
  desactive?: boolean;
  badge?: string;
}

function LigneReglage({
  titre,
  description,
  actif,
  onChange,
  desactive,
  badge,
}: LigneReglageProps) {
  const switchId = useId();
  const descId = useId();

  return (
    <div className="flex items-start justify-between gap-4 px-5 py-5">
      <div className={desactive ? "opacity-60" : undefined}>
        <Label
          htmlFor={switchId}
          className="flex flex-wrap items-center gap-2 text-[16px] leading-snug font-semibold text-navy"
        >
          {titre}
          {badge && (
            <span className="rounded-full bg-ink/8 px-2 py-0.5 text-[11px] font-medium text-ink/60">
              {badge}
            </span>
          )}
        </Label>
        <p id={descId} className="mt-1 text-[14px] leading-snug text-ink/60">
          {description}
        </p>
      </div>

      <Switch
        id={switchId}
        checked={actif}
        onCheckedChange={(valeur) => onChange?.(valeur)}
        disabled={desactive}
        aria-describedby={descId}
        className="mt-1 shrink-0 data-checked:bg-signal data-[state=checked]:bg-signal"
      />
    </div>
  );
}

export function PreferencesNotificationsForm({
  preferences,
}: {
  preferences: PreferencesNotifications;
}) {
  const navigate = useNavigate();
  const { mutateAsync: modifier, isPending } = useModifierPreferences();
  const [push, setPush] = useState(preferences.notificationsPush);

  // Activer les alertes demande d'abord l'autorisation du navigateur
  async function basculerPush(valeur: boolean) {
    if (valeur && typeof Notification !== "undefined") {
      if (Notification.permission === "denied") {
        toast.error(
          "Les notifications sont bloquées dans les réglages de votre navigateur.",
        );
        return;
      }
      if (Notification.permission === "default") {
        const resultat = await Notification.requestPermission();
        if (resultat !== "granted") {
          toast.error("Autorisez les notifications pour les activer.");
          return;
        }
      }
    }
    setPush(valeur);
  }

  async function enregistrer() {
    // Rien n'a changé : pas d'appel inutile
    if (push === preferences.notificationsPush) {
      navigate(profilRoutes.accueil);
      return;
    }
    try {
      await modifier({ notificationsPush: push });
      toast.success("Préférences enregistrées.");
      navigate(profilRoutes.accueil, { replace: true });
    } catch {
      toast.error("Impossible d'enregistrer. Réessayez.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white shadow-sm">
        <LigneReglage
          titre="Notifications sur ce téléphone"
          description="Alertes instantanées dès qu'un professionnel répond à votre demande."
          actif={push}
          onChange={basculerPush}
          desactive={isPending}
        />
        <LigneReglage
          titre="SMS de secours"
          description="Envoi d'un SMS gratuit si vous êtes hors-ligne ou si les notifications sont coupées."
          actif={SMS_DISPONIBLE && preferences.smsSecours}
          desactive
          badge="Bientôt disponible"
        />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-ink/10 bg-ink/3 px-5 py-4">
        <Shield className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden />
        <p className="text-[14px] leading-snug text-ink/70">
          Nous ne vous écrivons que pour vos demandes. Aucun message
          promotionnel ni publicité.
        </p>
      </div>

      <Button
        type="button"
        onClick={enregistrer}
        disabled={isPending}
        className="mt-6 h-14 w-full rounded-xl bg-signal px-6 text-[15px] font-semibold text-paper shadow-[0_8px_22px_rgba(249,97,13,0.32)] hover:bg-signal/90"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enregistrement…
          </>
        ) : (
          "Enregistrer les préférences"
        )}
      </Button>
    </div>
  );
}