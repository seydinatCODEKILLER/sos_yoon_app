import { useState } from "react";
import { KeyRound, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/lib/toast";
import { DialogMotDePasseAdmin } from "./DialogMotDePasseAdmin";

interface Props {
  /** Ouvre l'onglet « Sessions & Appareils » (un mot de passe changé ne déconnecte pas les autres appareils). */
  onVoirSessions: () => void;
}

export function SecuriteAdmin({ onVoirSessions }: Props) {
  const [dialogue, setDialogue] = useState(false);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="border-b border-border pb-5">
          <h2 className="text-lg font-semibold">Mot de passe</h2>
          <p className="text-sm text-muted-foreground">
            Protège l'accès à l'espace d'administration. Changez-le régulièrement et ne le réutilisez pas ailleurs.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal">
              <KeyRound className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Mot de passe de connexion</p>
              <p className="text-xs text-muted-foreground">
                8 caractères minimum, avec au moins un chiffre et un symbole.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setDialogue(true)} className="shrink-0">
            Modifier le mot de passe
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium">Un autre appareil a-t-il accès à votre compte ?</p>
            <p className="text-xs text-muted-foreground">
              Changer de mot de passe ne ferme pas les sessions déjà ouvertes. Vérifiez-les et déconnectez celles que
              vous ne reconnaissez pas.
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={onVoirSessions} className="shrink-0">
          <MonitorSmartphone className="size-4" /> Voir les appareils connectés
        </Button>
      </section>

      <DialogMotDePasseAdmin
        ouvert={dialogue}
        onFermer={() => setDialogue(false)}
        onSucces={() => toast.success("Mot de passe mis à jour")}
      />
    </div>
  );
}