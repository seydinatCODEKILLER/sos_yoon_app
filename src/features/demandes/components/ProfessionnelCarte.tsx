import type { ReactNode } from "react";
import { BadgeCheck, Check, MapPin, Star } from "lucide-react";
import { mediaUrl } from "@/shared/lib/mediaUrl";
import type { ProfessionnelPublic } from "../types/demande.types";
import { initiales } from "../lib/contactProfessionnel";

interface ProfessionnelCarteProps {
  pro: ProfessionnelPublic;
  /** Coche verte sur la photo (professionnel qui a accepté) */
  confirme?: boolean;
  /** Ligne supplémentaire sous les informations (pastille, délai…) */
  children?: ReactNode;
}

/** Ce que le citoyen voit d'un professionnel : photo, nom, titre, proximité, note */
export function ProfessionnelCarte({
  pro,
  confirme = false,
  children,
}: ProfessionnelCarteProps) {
  const photo = mediaUrl(pro.photoUrl);
  const specialite = pro.specialites?.find((s) => s.dominante)?.libelle;

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        {photo ? (
          <img
            src={photo}
            alt=""
            className="size-14 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid size-14 place-items-center rounded-full bg-navy text-base font-semibold text-paper"
          >
            {initiales(pro.nomComplet)}
          </span>
        )}
        {confirme && (
          <span className="absolute -right-0.5 -bottom-0.5 grid size-5 place-items-center rounded-full bg-emerald-600 text-white ring-2 ring-white">
            <Check className="size-3" strokeWidth={3} aria-hidden />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5">
          <span className="truncate text-base font-bold text-navy">
            {pro.nomComplet}
          </span>
          {pro.verifie && (
            <BadgeCheck
              className="size-5 shrink-0 fill-signal text-white"
              aria-label="Professionnel vérifié"
            />
          )}
        </p>
        {(pro.titre || specialite) && (
          <p className="text-[13px] leading-snug text-ink/60">
            {[pro.titre, specialite].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink/60">
          {pro.proximite && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden />
              {pro.proximite}
            </span>
          )}
          {pro.noteMoyenne != null && (pro.nombreAvis ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
              {pro.noteMoyenne.toLocaleString("fr-FR", {
                maximumFractionDigits: 1,
              })}{" "}
              ({pro.nombreAvis})
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}