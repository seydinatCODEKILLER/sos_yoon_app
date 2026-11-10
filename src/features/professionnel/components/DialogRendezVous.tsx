import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Trash2 } from "lucide-react";
import { toApiErreur } from "@/shared/lib/apiError";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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
  useDossiersLiables,
  useModifierRendezVous,
  useSupprimerRendezVous,
} from "../hooks/useAgenda";
import { TYPES_RDV_CONFIG, ajouterHeures, deIso, versIso } from "../lib/agenda";
import { CHAMP_FORMULAIRE, codeAgenda, messageAgenda } from "../lib/erreursAgenda";
import { rendezVousSchema, TYPES_RDV, type RendezVousValues } from "../schema/rendezVous.schema";
import type { RendezVous } from "../types/agenda.types";

export interface EtatDialogueRendezVous {
  /** null = création */
  rdv: RendezVous | null;
  /** Date proposée à la création (AAAA-MM-JJ) */
  date: string;
  /** Heure de début proposée à la création (HH:MM), par exemple celle du créneau cliqué */
  heure?: string;
}

interface FormulaireProps {
  etat: EtatDialogueRendezVous;
  onFermer: () => void;
}

function Formulaire({ etat, onFermer }: FormulaireProps) {
  const { rdv } = etat;
  const creer = useCreerRendezVous();
  const modifier = useModifierRendezVous();
  const supprimer = useSupprimerRendezVous();
  const { data: dossiers } = useDossiersLiables();
  const [erreur, setErreur] = useState<string | null>(null);
  const [confirmerSuppression, setConfirmerSuppression] = useState(false);
  const enCours = creer.isPending || modifier.isPending || supprimer.isPending;

  const debut = rdv ? deIso(rdv.debut) : null;
  const fin = rdv ? deIso(rdv.fin) : null;

  const form = useForm<RendezVousValues>({
    resolver: zodResolver(rendezVousSchema),
    defaultValues: {
      titre: rdv?.titre ?? "",
      type: rdv?.type ?? "CABINET",
      date: debut?.date ?? etat.date,
      heureDebut: debut?.heure ?? etat.heure ?? "09:00",
      heureFin: fin?.heure ?? (etat.heure ? ajouterHeures(etat.heure, 1) : "10:00"),
      lieu: rdv?.lieu ?? "",
      dossierDemandeId: rdv?.dossierDemandeId ?? "AUCUN",
    },
  });
  const erreurs = form.formState.errors;

  // Les dossiers clôturés ne sont proposés que s'ils sont déjà liés à ce rendez-vous
  const optionsDossiers = [
    { value: "AUCUN", label: "Aucun dossier" },
    ...(dossiers?.contenu ?? [])
      .filter((d) => d.statutDossier !== "CLOTURE" || d.demandeId === rdv?.dossierDemandeId)
      .map((d) => ({
        value: d.demandeId,
        label: `${d.reference} · ${d.citoyenNom ?? "Client"}`,
      })),
  ];
  if (rdv?.dossierDemandeId && !optionsDossiers.some((o) => o.value === rdv.dossierDemandeId)) {
    optionsDossiers.push({
      value: rdv.dossierDemandeId,
      label: rdv.dossierReference ?? "Dossier lié",
    });
  }

  async function enregistrer(values: RendezVousValues) {
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
      if (rdv) await modifier.mutateAsync({ id: rdv.id, payload });
      else await creer.mutateAsync(payload);
      onFermer();
    } catch (e) {
      // 400 VALIDATION_ERREUR : chaque message s'affiche sous son champ
      let sousUnChamp = false;
      for (const d of toApiErreur(e).details ?? []) {
        const champ = CHAMP_FORMULAIRE[d.champ];
        if (champ) {
          form.setError(champ as keyof RendezVousValues, { message: d.message });
          sousUnChamp = true;
        }
      }
      // 422 PERIODE_INVALIDE : le problème vient de l'heure de fin
      if (codeAgenda(e) === "PERIODE_INVALIDE") {
        form.setError("heureFin", { message: messageAgenda(e, "") });
        sousUnChamp = true;
      }
      if (!sousUnChamp) {
        setErreur(messageAgenda(e, "Impossible d'enregistrer le rendez-vous.", !!rdv));
      }
    }
  }

  async function retirer() {
    if (!rdv) return;
    setErreur(null);
    try {
      await supprimer.mutateAsync(rdv.id);
      onFermer();
    } catch (e) {
      // Déjà supprimé ailleurs : le résultat voulu est atteint
      if (codeAgenda(e) === "INTROUVABLE") onFermer();
      else setErreur(messageAgenda(e, "Impossible de supprimer le rendez-vous.", true));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(enregistrer)} noValidate className="space-y-4">
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
        {erreurs.titre && (
          <p role="alert" className="text-sm text-red-600">
            {erreurs.titre.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-ink">Type</Label>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <div role="group" aria-label="Type de rendez-vous" className="grid grid-cols-4 gap-2">
              {TYPES_RDV.map((t) => {
                const cfg = TYPES_RDV_CONFIG[t];
                const Icone = cfg.icone;
                const actif = field.value === t;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={actif}
                    disabled={enCours}
                    onClick={() => field.onChange(t)}
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 px-1 py-2 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-60 ${
                      actif
                        ? "border-signal bg-signal/5 text-ink"
                        : "border-ink/10 text-ink/65 hover:bg-ink/3"
                    }`}
                  >
                    <Icone className="size-4" aria-hidden />
                    {cfg.libelle}
                  </button>
                );
              })}
            </div>
          )}
        />
        {erreurs.type && (
          <p role="alert" className="text-sm text-red-600">
            {erreurs.type.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="rdv-date" className="text-sm font-medium text-ink">
            Date
          </Label>
          <Input
            id="rdv-date"
            type="date"
            disabled={enCours}
            aria-invalid={!!erreurs.date}
            {...form.register("date")}
          />
          {erreurs.date && (
            <p role="alert" className="text-sm text-red-600">
              {erreurs.date.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rdv-debut" className="text-sm font-medium text-ink">
            Début
          </Label>
          <Input
            id="rdv-debut"
            type="time"
            disabled={enCours}
            aria-invalid={!!erreurs.heureDebut}
            {...form.register("heureDebut")}
          />
          {erreurs.heureDebut && (
            <p role="alert" className="text-sm text-red-600">
              {erreurs.heureDebut.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rdv-fin" className="text-sm font-medium text-ink">
            Fin
          </Label>
          <Input
            id="rdv-fin"
            type="time"
            disabled={enCours}
            aria-invalid={!!erreurs.heureFin}
            {...form.register("heureFin")}
          />
          {erreurs.heureFin && (
            <p role="alert" className="text-sm text-red-600">
              {erreurs.heureFin.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rdv-lieu" className="text-sm font-medium text-ink">
          Lieu ou lien <span className="font-normal text-ink/50">(facultatif)</span>
        </Label>
        <Input
          id="rdv-lieu"
          disabled={enCours}
          maxLength={160}
          aria-invalid={!!erreurs.lieu}
          placeholder="Tribunal, cabinet, lien de visioconférence…"
          {...form.register("lieu")}
        />
        {erreurs.lieu && (
          <p role="alert" className="text-sm text-red-600">
            {erreurs.lieu.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-ink">
          Dossier lié <span className="font-normal text-ink/50">(facultatif)</span>
        </Label>
        <Controller
          control={form.control}
          name="dossierDemandeId"
          render={({ field }) => (
            <Select
              items={optionsDossiers}
              value={field.value}
              onValueChange={(v: string | null) => v && field.onChange(v)}
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
        {erreurs.dossierDemandeId && (
          <p role="alert" className="text-sm text-red-600">
            {erreurs.dossierDemandeId.message}
          </p>
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

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        {rdv ? (
          confirmerSuppression ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={enCours}
                onClick={retirer}
              >
                {supprimer.isPending ? "Suppression…" : "Confirmer la suppression"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={enCours}
                onClick={() => setConfirmerSuppression(false)}
              >
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
          <Button type="button" variant="outline" disabled={enCours} onClick={onFermer}>
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={enCours}
            className="bg-signal font-semibold text-white hover:bg-signal/90"
          >
            {creer.isPending || modifier.isPending ? "Enregistrement…" : "Enregistrer"}
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
  return (
    <Dialog
      open={etat !== null}
      onOpenChange={(ouvert) => {
        if (!ouvert) onFermer();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-4 overflow-y-auto sm:max-w-xl">
        <div className="space-y-1">
          <DialogTitle className="text-lg font-bold text-ink">
            {etat?.rdv ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
          </DialogTitle>
          <DialogDescription className="text-sm text-ink/60">
            Audience, rendez-vous ou appel, lié si vous le souhaitez à l'un de vos dossiers.
          </DialogDescription>
        </div>
        {/* Une instance par rendez-vous : le formulaire repart à zéro à chaque ouverture */}
        {etat && (
          <Formulaire
            key={`${etat.rdv?.id ?? "nouveau"}-${etat.date}-${etat.heure ?? ""}`}
            etat={etat}
            onFermer={onFermer}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}