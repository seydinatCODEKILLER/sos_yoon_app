import { useState } from "react";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DialogMotDePasseAdmin } from "./DialogMotDePasseAdmin";

export function SecuriteAdmin() {
  const [dialogue, setDialogue] = useState(false);
  const [modifie, setModifie] = useState(false);

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-4 border-b border-border pb-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Sécurité &amp; accès au compte</h2>
          <p className="text-sm text-muted-foreground">Paramètres d'authentification et gestion des accès.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Lock className="size-4" />
          </span>
          <div className="space-y-1">
            <p className="font-medium">Mot de passe de connexion</p>
            <p className="text-sm text-muted-foreground">
              Choisissez un mot de passe robuste que vous n'utilisez nulle part ailleurs.
            </p>
            {modifie && (
              <p className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
                <Check className="size-3.5" /> Mot de passe mis à jour.
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" className="shrink-0" onClick={() => setDialogue(true)}>
          Mettre à jour le mot de passe
        </Button>
      </div>

      <DialogMotDePasseAdmin ouvert={dialogue} onFermer={() => setDialogue(false)} onSucces={() => setModifie(true)} />
    </section>
  );
}