import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Trash2 } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  useCreerRendezVous,
  useModifierRendezVous,
  useSupprimerRendezVous,
} from "../hooks/useAgenda";
import { useDossiers } from "../hooks/useDossiers";
import { TYPES_RDV_CONFIG, deIso, versIso } from "../lib/agenda";
import {
  rendezVousSchema,
  TYPES_RDV,
  type RendezVousValues,
} from "../schema/rendezVous.schema";
import type { RendezVous, TypeRendezVous } from "../types/agenda.types";

export interface EtatDialogueRendezVous {
  /** null = création */
  rdv: RendezVous | null;
  /** Date proposée à la création (AAAA-MM-JJ) */
  date: string;
}

const TYPES_ITEMS = TYPES_RDV.map((t) => ({ value: t, label: TYPES_RDV_CONFIG[t].libelle }));
const messageErreur = (e: unknown, defaut: string) => (e as Partial<ApiErreur>).message ?? defaut;

interface FormulaireProps {
  etat: EtatDialogueRendezVous;
  enCours: boolean;
  erreur: string | null;
  onAnnuler: () => void;
  onEnregistrer: (values: RendezVousValues) => void;
  onSupprimer: () => void;
}

function Formulaire({ etat, enCours, erreur, onAnnuler, onEnregistrer, onSupprimer }: FormulaireProps) {
  const { rdv } = etat;
  const [confirmerSuppression, setConfirmerSuppression] = useState(false);
  const { data: dossiers } = useDossiers("TOUS", "", 0);

  const debut = rdv ? deIso(rdv.debut) : null;
  const fin = rdv ? deIso(rdv.fin) : null;

  const form = useForm<RendezVousValues>({
    resolver: zodResolver(rendezVousSchema),
    defaultValues: {
      titre: rdv?.titre ?? "",
      type: rdv?.type ?? "CABINET",
      date: debut?.date ?? etat.date,
      heureDebut: debut?.heure ?? "09:00",
      heureFin: fin?.heure ?? "10:00",
      lieu: rdv?.lieu ?? "",
      dossierDemandeId: rdv?.dossierDemandeId ?? "AUCUN",
    },
  });
  const erreurs = form.formState.errors;

  const optionsDossiers = [
    { value: "AUCUN", label: "Aucun dossier" },
    ...(dossiers?.contenu ?? []).map((d) => ({
      value: d.demandeId,
      label: `${d.reference} · ${d.citoyenNom}`,
    })),
  ];
  if (rdv?.dossierDemandeId && !optionsDossiers.some((o) => o.value === rdv.dossierDemandeId)) {
    optionsDossiers.push({
      value: rdv.dossierDemandeId,
      label: rdv.dossierReference ?? "Dossier lié",
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onEnregistrer)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="rdv-titre" className="text-sm font-medium text-ink">
          Titre
        </Label>
        <Input
          id="rdv-titre"
          disabled={enCours}
          aria-invalid={!!erreurs.titre}
          placeholder="Ex. : Audience, entretien avec le client…"
          {...form.register("titre")}
        />
        {erreurs.titre && <p role="alert" className="text-sm text-red-600">{erreurs.titre.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-ink">Type</Label>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Select
                items={TYPES_ITEMS}
                value={field.value}
                onValueChange={(v) => v && field.onChange(v as TypeRendezVous)}
                disabled={enCours}
              >
                <SelectTrigger className="w-full" aria-label="Type de rendez-vous">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES_ITEMS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-ink">Dossier lié (facultatif)</Label>
          <Controller
            control={form.control}
            name="dossierDemandeId"
            render={({ field }) => (
              <Select
                items={optionsDossiers}
                value={field.value}
                onValueChange={(v) => v && field.onChange(v)}
                disabled={enCours}
              >
                <SelectTrigger className="w-full" aria-label="Dossier lié">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {optionsDossiers.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="rdv-date" className="text-sm font-medium text-ink">
            Date
          </Label>
          <Input id="rdv-date" type="date" disabled={enCours} aria-invalid={!!erreurs.date} {...form.register("date")} />
          {erreurs.date && <p role="alert" className="text-sm text-red-600">{erreurs.date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rdv-debut" className="text-sm font-medium text-ink">
            Début
          </Label>
          <Input id="rdv-debut" type="time" disabled={enCours} aria-invalid={!!erreurs.heureDebut} {...form.register("heureDebut")} />
          {erreurs.heureDebut && <p role="alert" className="text-sm text-red-600">{erreurs.heureDebut.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rdv-fin" className="text-sm font-medium text-ink">
            Fin
          </Label>
          <Input id="rdv-fin" type="time" disabled={enCours} aria-invalid={!!erreurs.heureFin} {...form.register("heureFin")} />
          {erreurs.heureFin && <p role="alert" className="text-sm text-red-600">{erreurs.heureFin.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rdv-lieu" className="text-sm font-medium text-ink">
          Lieu ou lien (facultatif)
        </Label>
        <Input
          id="rdv-lieu"
          disabled={enCours}
          placeholder="Tribunal, cabinet, lien de visioconférence…"
          {...form.register("lieu")}
        />
      </div>

      {erreur && (
        <p role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {erreur}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        {rdv ? (
          confirmerSuppression ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={enCours}
                onClick={onSupprimer}
              >
                Confirmer la suppression
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmerSuppression(false)}>
                Non
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={enCours}
              onClick={() => setConfirmerSuppression(true)}
              className="justify-start text-red-600 hover:text-red-700"
            >
              <Trash2 className="size-4" aria-hidden />
              Supprimer
            </Button>
          )
        ) : (
          <span />
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" disabled={enCours} onClick={onAnnuler}>
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={enCours}
            className="bg-signal font-semibold text-white hover:bg-signal/90"
          >
            {enCours ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </div>
    </form>
  );
}

interface DialogRendezVousProps {
  /** null = fenêtre fermée */
  etat: EtatDialogueRendezVous | null;
  onFermer: () => void;
}

export function DialogRendezVous({ etat, onFermer }: DialogRendezVousProps) {
  const creer = useCreerRendezVous();
  const modifier = useModifierRendezVous();
  const supprimer = useSupprimerRendezVous();
  const [erreur, setErreur] = useState<string | null>(null);
  const enCours = creer.isPending || modifier.isPending || supprimer.isPending;

  function fermer() {
    setErreur(null);
    onFermer();
  }

  async function enregistrer(values: RendezVousValues) {
    if (!etat) return;
    setErreur(null);
    const payload = {
      titre: values.titre,
      type: values.type,
      debut: versIso(values.date, values.heureDebut),
      fin: versIso(values.date, values.heureFin),
      lieu: values.lieu || null,
      dossierDemandeId: values.dossierDemandeId === "AUCUN" ? null : values.dossierDemandeId,
    };
    try {
      if (etat.rdv) await modifier.mutateAsync({ id: etat.rdv.id, payload });
      else await creer.mutateAsync(payload);
      fermer();
    } catch (e) {
      setErreur(messageErreur(e, "Impossible d'enregistrer le rendez-vous."));
    }
  }

  async function retirer() {
    if (!etat?.rdv) return;
    setErreur(null);
    try {
      await supprimer.mutateAsync(etat.rdv.id);
      fermer();
    } catch (e) {
      setErreur(messageErreur(e, "Impossible de supprimer le rendez-vous."));
    }
  }

  return (
    <Dialog
      open={etat !== null}
      onOpenChange={(ouvert) => {
        if (!ouvert && !enCours) fermer();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-4 overflow-y-auto sm:max-w-xl">
        <div className="space-y-1">
          <DialogTitle className="text-lg font-bold text-ink">
            {etat?.rdv ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
          </DialogTitle>
          <DialogDescription className="text-sm text-ink/60">
            Audience, rendez-vous ou appel lié, si vous le souhaitez, à l'un de vos dossiers.
          </DialogDescription>
        </div>
        {etat && (
          <Formulaire
            key={etat.rdv?.id ?? "nouveau"}
            etat={etat}
            enCours={enCours}
            erreur={erreur}
            onAnnuler={fermer}
            onEnregistrer={enregistrer}
            onSupprimer={retirer}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}