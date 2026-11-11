import { useState } from "react";
import { Ban, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAnnulerDemande, useMotifsAnnulation } from "../hooks/useDemandesAdmin";
import { messageAdmin } from "../lib/erreursAdmin";
import type { DemandeAdmin } from "../types/demandes.types";

interface Props {
  cible: DemandeAdmin | null;
  onFermer: () => void;
}

export function DialogAnnulerDemande({ cible, onFermer }: Props) {
  return (
    <Dialog open={!!cible} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {cible && <Formulaire key={cible.id} cible={cible} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}

function Formulaire({ cible, onFermer }: { cible: DemandeAdmin; onFermer: () => void }) {
  const { data: motifs = [] } = useMotifsAnnulation(true);
  const { mutate, isPending, error } = useAnnulerDemande();
  const [motifId, setMotifId] = useState("");
  const [observations, setObservations] = useState("");

  const prisEnCharge = !!cible.professionnel;
  const consequences = [
    "La demande passe au statut « Annulée » et ne peut plus être rouverte.",
    prisEnCharge
      ? `La prise en charge par ${cible.professionnel} prend fin.`
      : "Les professionnels sollicités ne peuvent plus répondre.",
    "Le citoyen est prévenu par notification et par SMS, avec le motif.",
  ];

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10">
          <Ban className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">Annuler cette demande ?</DialogTitle>
          <DialogDescription>
            Vous allez annuler la demande{" "}
            <strong className="font-semibold text-foreground tabular-nums">{cible.reference ?? "sans référence"}</strong>
            {cible.citoyen?.nomComplet ? ` de ${cible.citoyen.nomComplet}` : ""}.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-5 px-6 pb-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400">
            <Info className="size-4 shrink-0" aria-hidden /> Ce qui se passe ensuite :
          </p>
          <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-foreground/80">
            {consequences.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <Label>
            Motif de l'annulation <span className="text-destructive">*</span>
          </Label>
          <Select
            value={motifId}
            onValueChange={(v) => setMotifId(v ?? "")}
            items={motifs.map((m) => ({ value: m.id, label: m.libelle }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un motif" />
            </SelectTrigger>
            <SelectContent>
              {motifs.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations-annulation">
            Observations <span className="font-normal text-muted-foreground">(facultatif)</span>
          </Label>
          <Textarea
            id="observations-annulation"
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Précisions pour le journal d'audit."
            className="resize-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messageAdmin(error, "Impossible d'annuler cette demande.")}
          </p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Garder la demande
        </Button>
        <Button
          className="bg-rose-600 text-white hover:bg-rose-700"
          disabled={!motifId || isPending}
          onClick={() =>
            mutate(
              {
                id: cible.id,
                payload: { motifId, observations: observations.trim() || undefined },
              },
              { onSuccess: onFermer },
            )
          }
        >
          <Ban className="size-4" aria-hidden />
          {isPending ? "En cours…" : "Annuler la demande"}
        </Button>
      </DialogFooter>
    </>
  );
}