import { useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Camera, Gavel, ShieldCheck, Star, Target, Zap } from "lucide-react";
import { useAbonnementDetail } from "../hooks/useAbonnement";
import { PROFIL_KEY, useEnvoyerPhoto } from "../hooks/useProfil";
import { dashboardService } from "../lib/dashboardService";
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

  // Même service que l'interrupteur du tableau de bord
  const disponibilite = useMutation({
    mutationFn: (disponible: boolean) => dashboardService.changerDisponibilite(disponible),
    onSuccess: (_r, disponible) => {
      queryClient.setQueryData<ProfilPro>(PROFIL_KEY, (p) => (p ? { ...p, disponible } : p));
      queryClient.invalidateQueries({ queryKey: ["pro", "dashboard"] });
    },
  });

  function choisir(e: ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    e.target.value = "";
    if (!fichier) return;
    if (!["image/jpeg", "image/png"].includes(fichier.type)) return setErreur("JPG ou PNG uniquement.");
    if (fichier.size > TAILLE_MAX) return setErreur("3 Mo maximum.");
    setErreur(null);
    envoyer.mutate(fichier, { onError: () => setErreur("Envoi de la photo impossible.") });
  }

  const libellePlan = !abo
    ? null
    : abo.statut === "ESSAI"
      ? `Essai gratuit · ${abo.joursRestants} j`
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
            {profil.photoUrl ? (
              <img src={profil.photoUrl} alt="" className="size-22 rounded-2xl object-cover" />
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
              {s.noteMoyenne.toFixed(1)}
              <span className="text-xs font-medium text-ink/50"> / 5</span>
            </dd>
            <dd className="text-[11px] text-ink/60">{s.nombreAvis} avis vérifiés</dd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <Target className="size-5 text-emerald-700" aria-hidden />
          </span>
          <div>
            <dt className="sr-only">Taux d'acceptation</dt>
            <dd className="text-lg leading-tight font-bold text-ink">{s.tauxAcceptation}%</dd>
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
              className={`size-5 ${profil.disponible ? "text-emerald-700" : "text-ink/40"}`}
              aria-hidden
            />
          </span>
          <div>
            <dt className="sr-only">Statut</dt>
            <dd
              className={`flex items-center gap-1.5 text-sm font-bold ${
                profil.disponible ? "text-emerald-700" : "text-ink/55"
              }`}
            >
              <span
                className={`size-2 rounded-full ${profil.disponible ? "bg-emerald-600" : "bg-ink/30"}`}
                aria-hidden
              />
              {profil.disponible ? "Actif SOS Yoon" : "Indisponible"}
            </dd>
            <dd>
              <button
                type="button"
                disabled={disponibilite.isPending}
                onClick={() => disponibilite.mutate(!profil.disponible)}
                className="text-[11px] font-semibold text-signal underline underline-offset-2 outline-none hover:text-signal/80 focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-60"
              >
                {disponibilite.isPending ? "Mise à jour…" : "Modifier statut"}
              </button>
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}