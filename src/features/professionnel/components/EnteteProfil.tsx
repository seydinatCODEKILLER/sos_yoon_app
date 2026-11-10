import { useRef, useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Camera, Gavel, ShieldCheck, Star, Target, Zap } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { mediaUrl } from "@/shared/lib/mediaUrl";
import { useAbonnementDetail } from "../hooks/useAbonnement";
import { useDisponibilite } from "../hooks/useDisponibilite";
import { PROFIL_KEY, useEnvoyerPhoto } from "../hooks/useProfil";
import { messageEspacePro } from "../lib/erreurSollicitation";
import { formaterDelaiMoyen, initialesProfil } from "../lib/profil";
import type { ProfilPro } from "../types/profil.types";

const TAILLE_MAX = 3 * 1024 * 1024;

interface EnteteProfilProps {
  profil: ProfilPro;
  /** Ouvre l'onglet Abonnement */
  onVoirAbonnement: () => void;
}

export function EnteteProfil({ profil, onVoirAbonnement }: EnteteProfilProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const envoyer = useEnvoyerPhoto();
  const { data: abo } = useAbonnementDetail();
  const s = profil.statistiques;

  // Même mutation que l'interrupteur du tableau de bord (message d'erreur compris)
  const disponibilite = useDisponibilite();
  function basculer(valeur: boolean) {
    disponibilite.mutate(valeur, {
      onSuccess: () =>
        queryClient.setQueryData<ProfilPro>(PROFIL_KEY, (p) =>
          p ? { ...p, disponible: valeur } : p,
        ),
    });
  }

  // Affichage optimiste de l'interrupteur pendant l'appel (comme sur le tableau de bord)
  const disponible = disponibilite.isPending
    ? (disponibilite.variables ?? profil.disponible)
    : profil.disponible;

  const photo = mediaUrl(profil.photoUrl);

  function choisir(e: ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    e.target.value = "";
    if (!fichier) return;
    if (!["image/jpeg", "image/png"].includes(fichier.type)) return setErreur("JPG ou PNG uniquement.");
    if (fichier.size > TAILLE_MAX) return setErreur("3 Mo maximum.");
    setErreur(null);
    envoyer.mutate(fichier, {
      onError: (e) => setErreur(messageEspacePro(e, "Envoi de la photo impossible.")),
    });
  }

  const libellePlan = !abo
    ? null
    : abo.statut === "ESSAI"
      ? `Essai gratuit · ${abo.joursRestants ?? 0} j`
      : abo.statut === "ACTIF"
        ? "Abonnement actif"
        : "Compte suspendu";

  const ligneCabinet = [profil.titre, profil.adresseCabinet].filter(Boolean).join(" · ");

  return (
    <section className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      {/* Halo orange en haut à droite */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-signal/15 blur-3xl"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative size-22 shrink-0">
            {photo ? (
              <img src={photo} alt="" className="size-22 rounded-2xl object-cover" />
            ) : (
              <span className="flex size-22 items-center justify-center rounded-2xl bg-navy text-2xl font-bold text-white">
                {initialesProfil(profil.prenom, profil.nom)}
              </span>
            )}

            {profil.statutCompte === "ACTIF" && (
              <span
                className="absolute -right-2 -bottom-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white"
                title="Compte vérifié"
              >
                <ShieldCheck className="size-4" aria-hidden />
                <span className="sr-only">Compte vérifié</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={envoyer.isPending}
              aria-label="Changer la photo de profil"
              className="absolute -bottom-2 -left-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-signal text-white shadow outline-none hover:bg-signal/90 focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-60"
            >
              <Camera className="size-3.5" aria-hidden />
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={choisir}
            />
          </div>

          <div className="min-w-0 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-ink">{profil.nomComplet}</h2>
            <p className="text-sm text-ink/70">{ligneCabinet}</p>
            {profil.matricule && (
              <p className="flex items-center gap-1.5 text-xs text-ink/65">
                <Gavel className="size-3.5 shrink-0 text-ink/45" aria-hidden />
                Inscrit sous le N° <strong className="font-bold text-ink">{profil.matricule}</strong>
              </p>
            )}
            {envoyer.isPending && <p className="text-xs text-ink/55">Envoi de la photo…</p>}
            {erreur && (
              <p role="alert" className="text-xs text-red-600">
                {erreur}
              </p>
            )}
          </div>
        </div>

        {libellePlan && (
          <button
            type="button"
            onClick={onVoirAbonnement}
            className="shrink-0 self-start rounded-xl border border-signal/25 bg-signal/15 px-5 py-2.5 text-sm font-semibold text-ink outline-none hover:bg-signal/25 focus-visible:ring-2 focus-visible:ring-signal"
          >
            {libellePlan}
          </button>
        )}
      </div>

      <dl className="relative mt-5 grid grid-cols-2 gap-4 rounded-xl bg-ink/4 p-4 lg:grid-cols-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <Star className="size-5 fill-signal text-signal" aria-hidden />
          </span>
          <div>
            <dt className="sr-only">Note moyenne</dt>
            <dd className="text-lg leading-tight font-bold text-ink">
              {s.noteMoyenne === null ? "—" : s.noteMoyenne.toFixed(1)}
              <span className="text-xs font-medium text-ink/50"> / 5</span>
            </dd>
            <dd className="text-[11px] text-ink/60">
              {s.nombreAvis === 0
                ? "Aucun avis pour l'instant"
                : `${s.nombreAvis} avis`}
            </dd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <Target className="size-5 text-emerald-700" aria-hidden />
          </span>
          <div>
            <dt className="sr-only">Taux d'acceptation</dt>
            <dd className="text-lg leading-tight font-bold text-ink">{s.tauxAcceptation === null ? "—" : `${s.tauxAcceptation}%`}</dd>
            <dd className="text-[11px] text-ink/60">Taux d'acceptation</dd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <Zap className="size-5 text-signal" aria-hidden />
          </span>
          <div>
            <dt className="sr-only">Délai moyen</dt>
            <dd className="text-lg leading-tight font-bold text-ink">
              {formaterDelaiMoyen(s.delaiMoyenReponseSecondes)}
            </dd>
            <dd className="text-[11px] text-ink/60">Délai moyen d'intervention</dd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <Bell
              className={`size-5 ${disponible ? "text-emerald-700" : "text-ink/40"}`}
              aria-hidden
            />
          </span>
          <div className="min-w-0">
            <dt className="sr-only">Statut</dt>
            <dd>
              <Label
                htmlFor="profil-disponibilite"
                className={`flex items-center gap-1.5 text-sm font-bold ${
                  disponible ? "text-emerald-700" : "text-ink/55"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${disponible ? "bg-emerald-600" : "bg-ink/30"}`}
                  aria-hidden
                />
                {disponible ? "Actif SOS Yoon" : "Indisponible"}
              </Label>
            </dd>
            <dd className="mt-1 flex items-center gap-2">
              <Switch
                id="profil-disponibilite"
                checked={disponible}
                onCheckedChange={basculer}
                className="shrink-0 data-checked:bg-signal"
              />
              <span className="text-[11px] leading-tight text-ink/60">Recevoir les demandes</span>
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}