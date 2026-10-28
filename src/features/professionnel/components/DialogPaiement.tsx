import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { usePayerAbonnement } from "../hooks/useAbonnement";
import { LIBELLE_MOYEN, formaterDateIso, formaterFcfa } from "../lib/abonnement";
import { paiementSchema, type PaiementValues } from "../schema/paiement.schema";
import type { PaiementInitie } from "../types/abonnement.types";

interface FormulairePaiementProps {
  montant: number;
  onFermer: () => void;
}

function FormulairePaiement({ montant, onFermer }: FormulairePaiementProps) {
  const payer = usePayerAbonnement();
  const [resultat, setResultat] = useState<PaiementInitie | null>(null);
  const form = useForm<PaiementValues>({
    resolver: zodResolver(paiementSchema),
    defaultValues: { moyenPaiement: "WAVE", telephonePaiement: "" },
  });
  const erreur = form.formState.errors.telephonePaiement?.message;

  async function valider(v: PaiementValues) {
    payer.reset();
    try {
      const r = await payer.mutateAsync({
        moyenPaiement: v.moyenPaiement,
        telephonePaiement: v.telephonePaiement.replace(/\s/g, ""),
      });
      // Branchement réel : le prestataire renvoie une URL de paiement à ouvrir
      if (r.urlPaiement) {
        window.location.assign(r.urlPaiement);
        return;
      }
      setResultat(r);
    } catch {
      /* lue via payer.error */
    }
  }

  if (resultat) {
    return (
      <div className="space-y-4 text-center">
        <CircleCheck className="mx-auto size-12 text-emerald-600" aria-hidden />
        <div className="space-y-1">
          <p className="text-lg font-bold text-ink">Paiement réussi</p>
          <p className="text-sm text-ink/65">
            {formaterFcfa(resultat.montant)} réglés.
            {resultat.periodeFin && ` Abonnement actif jusqu'au ${formaterDateIso(resultat.periodeFin)}.`}
          </p>
        </div>
        <Button onClick={onFermer} className="bg-signal font-semibold text-white hover:bg-signal/90">
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(valider)} noValidate className="space-y-4">
      <div className="flex items-center justify-between rounded-lg bg-navy/5 px-4 py-3">
        <span className="text-sm text-ink/70">Abonnement d'un mois</span>
        <span className="text-lg font-bold text-ink">{formaterFcfa(montant)}</span>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-ink">Moyen de paiement</Label>
        <Controller
          control={form.control}
          name="moyenPaiement"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Moyen de paiement">
              {(Object.keys(LIBELLE_MOYEN) as (keyof typeof LIBELLE_MOYEN)[]).map((m) => {
                const actif = field.value === m;
                return (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={actif}
                    disabled={payer.isPending}
                    onClick={() => field.onChange(m)}
                    className={`rounded-lg border-2 px-3 py-2.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                      actif ? "border-signal bg-signal/5 text-ink" : "border-ink/10 text-ink/65 hover:bg-ink/3"
                    }`}
                  >
                    {LIBELLE_MOYEN[m]}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pay-tel" className="text-sm font-medium text-ink">
          Numéro à débiter
        </Label>
        <Input
          id="pay-tel"
          type="tel"
          inputMode="tel"
          placeholder="77 123 45 67"
          disabled={payer.isPending}
          aria-invalid={!!erreur}
          {...form.register("telephonePaiement")}
        />
        {erreur && (
          <p role="alert" className="text-sm text-red-600">
            {erreur}
          </p>
        )}
      </div>

      <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Paiement simulé : aucun montant ne sera débité.
      </p>

      {payer.isError && (
        <p role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {(payer.error as Partial<ApiErreur>).message ?? "Le paiement a échoué."}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" disabled={payer.isPending} onClick={onFermer}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={payer.isPending}
          className="bg-signal font-semibold text-white hover:bg-signal/90"
        >
          {payer.isPending ? "Paiement en cours…" : `Payer ${formaterFcfa(montant)}`}
        </Button>
      </div>
    </form>
  );
}

interface DialogPaiementProps {
  ouvert: boolean;
  montant: number;
  onFermer: () => void;
}

export function DialogPaiement({ ouvert, montant, onFermer }: DialogPaiementProps) {
  return (
    <Dialog open={ouvert} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-4 sm:max-w-md">
        <div className="space-y-1">
          <DialogTitle className="text-lg font-bold text-ink">Payer mon abonnement</DialogTitle>
          <DialogDescription className="text-sm text-ink/60">
            Réglez un mois d'abonnement par Wave ou Orange Money.
          </DialogDescription>
        </div>
        {/* Démonté à la fermeture : le formulaire repart à zéro */}
        {ouvert && <FormulairePaiement montant={montant} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}