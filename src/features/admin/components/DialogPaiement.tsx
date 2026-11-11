import { useState } from "react";
import { Banknote, CalendarCheck, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { toast } from "@/shared/lib/toast";
import { useEnregistrerPaiement } from "../hooks/useAbonnementAdmin";
import {
  MOYENS_PAIEMENT,
  aujourdhui,
  formaterJour,
  formaterMontant,
  periodeCouverte,
} from "../lib/abonnements";
import { messageAdmin } from "../lib/erreursAdmin";
import type { CiblePaiement, MoyenPaiement } from "../types/abonnements.types";

interface Props {
  cible: CiblePaiement | null;
  onFermer: () => void;
}

export function DialogPaiement({ cible, onFermer }: Props) {
  return (
    <Dialog open={!!cible} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {/* key : réinitialise le formulaire à chaque professionnel */}
        {cible && <Formulaire key={cible.professionnelId} cible={cible} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}

function Formulaire({ cible, onFermer }: { cible: CiblePaiement; onFermer: () => void }) {
  const { mutate, isPending, error } = useEnregistrerPaiement();
  const [moyen, setMoyen] = useState<MoyenPaiement | "">("");
  const [date, setDate] = useState(aujourdhui);
  const [reference, setReference] = useState("");

  const periode = date ? periodeCouverte(cible.echeance, date) : null;
  const montantConnu = cible.montantMensuel != null;
  const impaye = (cible.statutCompte ?? "").toUpperCase() === "SUSPENDU_IMPAYE";
  const peutEnvoyer = montantConnu && !!moyen && !!date && !isPending;

  function envoyer() {
    if (!peutEnvoyer || cible.montantMensuel == null || !moyen) return;
    mutate(
      {
        professionnelId: cible.professionnelId,
        payload: {
          montant: cible.montantMensuel,
          moyenPaiement: moyen,
          datePaiement: date,
          referenceExterne: reference.trim() || undefined,
        },
      },
      {
        onSuccess: (res) => {
          toast.success(
            "Paiement enregistré",
            `L'abonnement de ${cible.nomComplet} est valable jusqu'au ${formaterJour(res.abonnement.finPeriode)}.`,
          );
          onFermer();
        },
      },
    );
  }

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
          <Banknote className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Mensualité reçue de{" "}
            <strong className="font-semibold text-foreground">{cible.nomComplet}</strong>, hors de la plateforme.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-5 px-6 pb-6">
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">Montant attendu</span>
            <span className="text-xl font-semibold tabular-nums">{formaterMontant(cible.montantMensuel)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Le montant est fixé par les paramètres de la plateforme : seul ce montant exact est accepté.
          </p>
          {!montantConnu && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              Le montant mensuel n'a pas été fourni par le serveur : mettez le backend à jour.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Moyen de paiement <span className="text-destructive">*</span>
            </Label>
            <Select
              value={moyen}
              onValueChange={(v) => setMoyen((v ?? "") as MoyenPaiement | "")}
              items={MOYENS_PAIEMENT}
            >
              <SelectTrigger className="w-full" disabled={isPending}>
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {MOYENS_PAIEMENT.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-paiement">
              Date du paiement <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date-paiement"
              type="date"
              value={date}
              max={aujourdhui()}
              disabled={isPending}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference-paiement">
            Référence de la transaction <span className="font-normal text-muted-foreground">(facultatif)</span>
          </Label>
          <Input
            id="reference-paiement"
            value={reference}
            maxLength={100}
            disabled={isPending}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ex : WV-123456"
          />
          <p className="text-xs text-muted-foreground">
            Une même référence ne peut être enregistrée qu'une fois : elle évite les doublons.
          </p>
        </div>

        {periode && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <CalendarCheck className="size-4 shrink-0" aria-hidden />
              Période couverte : du {formaterJour(periode.debut)} au {formaterJour(periode.fin)}
            </p>
            {impaye && (
              <p className="mt-2 flex items-start gap-2 text-[13px] text-foreground/80">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                Le compte est suspendu pour impayé : il sera réactivé avec ce paiement.
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Estimation : le serveur calcule la période définitive à l'enregistrement.
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messageAdmin(error, "Impossible d'enregistrer ce paiement.")}
          </p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button disabled={!peutEnvoyer} onClick={envoyer}>
          {isPending ? "Enregistrement…" : "Enregistrer le paiement"}
        </Button>
      </DialogFooter>
    </>
  );
}