import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftRight, CircleAlert, Lock, Undo2 } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Textarea } from "@/shared/components/ui/textarea";
import { useRefuserSollicitation } from "../hooks/useRefuserSollicitation";
import { initiales } from "../lib/formatDashboard";
import {
  MOTIF_RECOMMANDE,
  MOTIFS_REFUS,
  type MotifRefus,
} from "../lib/motifsRefus";
import {
  refusSollicitationSchema,
  type RefusSollicitationValues,
} from "../schema/refusSollicitation.schema";
import type { SollicitationResume } from "../types/dashboard.types";

const MESSAGES_ERREUR: Record<string, string> = {
  SOLLICITATION_EXPIREE: "Cette demande a déjà expiré ou a été traitée.",
};

interface FormulaireRefusProps {
  enCours: boolean;
  erreur: string | null;
  onAnnuler: () => void;
  onSoumettre: (values: RefusSollicitationValues) => void;
}

function FormulaireRefus({
  enCours,
  erreur,
  onAnnuler,
  onSoumettre,
}: FormulaireRefusProps) {
  const form = useForm<RefusSollicitationValues>({
    resolver: zodResolver(refusSollicitationSchema),
    defaultValues: { motif: MOTIF_RECOMMANDE, commentaire: "" },
  });
  const motif = useWatch({ control: form.control, name: "motif" });
  const erreurCommentaire = form.formState.errors.commentaire?.message;

  return (
    <form
      onSubmit={form.handleSubmit(onSoumettre)}
      noValidate
      className="space-y-5"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">
            Motif de refus{" "}
            <span className="font-normal text-ink/50">
              (aide à l'amélioration du dispatch IA)
            </span>
          </p>
          <span className="text-[11px] font-bold text-red-600">
            Obligatoire
          </span>
        </div>

        <Controller
          control={form.control}
          name="motif"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(v) => field.onChange(v as MotifRefus)}
              disabled={enCours}
              aria-label="Motif de refus"
              className="grid gap-2"
            >
              {MOTIFS_REFUS.map((m) => (
                <Label
                  key={m.code}
                  htmlFor={`motif-${m.code}`}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-ink/10 bg-white px-3 py-2.5 text-sm font-normal text-ink/80 has-data-checked:border-signal has-data-checked:bg-signal/8 has-data-checked:font-semibold has-data-checked:text-ink"
                >
                  <RadioGroupItem
                    id={`motif-${m.code}`}
                    value={m.code}
                    className="data-checked:border-signal data-checked:bg-signal"
                  />
                  <span className="flex-1">{m.libelle}</span>
                  {m.code === MOTIF_RECOMMANDE && (
                    <Badge className="border-0 bg-signal/15 text-[10px] font-bold text-signal uppercase">
                      Recommandé
                    </Badge>
                  )}
                </Label>
              ))}
            </RadioGroup>
          )}
        />

        {motif === "AUTRE" && (
          <div className="space-y-1.5">
            <Label
              htmlFor="commentaire"
              className="text-sm font-medium text-ink"
            >
              Précisez votre motif
            </Label>
            <Textarea
              id="commentaire"
              rows={3}
              maxLength={500}
              disabled={enCours}
              aria-invalid={!!erreurCommentaire}
              placeholder="Expliquez brièvement pourquoi vous refusez cette demande."
              {...form.register("commentaire")}
            />
            {erreurCommentaire && (
              <p role="alert" className="text-sm text-red-600">
                {erreurCommentaire}
              </p>
            )}
          </div>
        )}
      </div>

      {erreur && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {erreur}
        </p>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          disabled={enCours}
          onClick={onAnnuler}
          className="h-11 rounded-lg text-sm font-semibold"
        >
          <Undo2 className="size-4" aria-hidden />
          Annuler et conserver la demande
        </Button>
        <Button
          type="submit"
          disabled={enCours}
          className="h-11 rounded-lg bg-rose-600 text-sm font-semibold text-white hover:bg-rose-600/90"
        >
          <ArrowLeftRight className="size-4" aria-hidden />
          {enCours ? "Refus en cours…" : "Confirmer le refus et réattribuer"}
        </Button>
      </div>
    </form>
  );
}

interface DialogRefusProps {
  /** null = fenêtre fermée */
  sollicitation: SollicitationResume | null;
  onFermer: () => void;
}

export function DialogRefus({ sollicitation: s, onFermer }: DialogRefusProps) {
  const refuser = useRefuserSollicitation();
  const [erreur, setErreur] = useState<string | null>(null);

  function fermer() {
    setErreur(null);
    onFermer();
  }

  async function soumettre(values: RefusSollicitationValues) {
    if (!s) return;
    setErreur(null);
    try {
      await refuser.mutateAsync({
        id: s.id,
        payload: {
          motif: values.motif,
          commentaire: values.commentaire || undefined,
        },
      });
      fermer();
    } catch (e) {
      const err = e as Partial<ApiErreur>;
      setErreur(
        (err.code && MESSAGES_ERREUR[err.code]) ??
          err.message ??
          "Impossible de refuser la demande.",
      );
    }
  }

  return (
    <Dialog
      open={s !== null}
      // Pas de fermeture pendant l'envoi
      onOpenChange={(ouvert) => {
        if (!ouvert && !refuser.isPending) fermer();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto sm:max-w-xl">
        {s && (
          <>
            <div className="flex items-start gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                <ArrowLeftRight className="size-6" aria-hidden />
              </span>
              <div className="space-y-2">
                <DialogTitle className="text-xl font-bold text-ink">
                  Confirmer le refus de cette demande ?
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-ink/65">
                  Cette demande sera{" "}
                  <strong className="text-ink">
                    immédiatement réattribuée
                  </strong>{" "}
                  à un autre confrère disponible afin de respecter l'engagement
                  de réactivité auprès du justiciable.
                </DialogDescription>
              </div>
            </div>

            {/* Récapitulatif de la demande */}
            <div className="rounded-xl border border-ink/10 bg-ink/5 p-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white"
                >
                  {initiales(s.citoyen.affichage)}
                </span>
                <div className="min-w-0 text-sm">
                  <p className="truncate font-semibold text-ink">
                    {s.citoyen.affichage}{" "}
                    <span className="font-normal text-ink/50">
                      · {s.libelleLocalisation}
                    </span>
                  </p>
                  <p className="text-xs text-ink/55">Réf : {s.reference}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 pt-3 text-xs">
                <p className="flex min-w-0 items-center gap-2 text-ink/80">
                  <Badge className="border-0 bg-signal/15 text-[10px] font-bold text-signal uppercase">
                    Objet
                  </Badge>
                  <span className="line-clamp-1">{s.extrait}</span>
                </p>
                <span className="inline-flex items-center gap-1 text-ink/50">
                  <Lock className="size-3" aria-hidden />
                  Coordonnées protégées &amp; non débitées
                </span>
              </div>
            </div>

            <FormulaireRefus
              key={s.id}
              enCours={refuser.isPending}
              erreur={erreur}
              onAnnuler={fermer}
              onSoumettre={soumettre}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
