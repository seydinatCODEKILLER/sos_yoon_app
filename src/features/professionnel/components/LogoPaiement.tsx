import { useState } from "react";
import type { MoyenPaiement } from "../types/abonnement.types";

/**
 * Logos officiels à déposer dans le dossier public/ du projet
 * (à télécharger depuis l'espace presse / marque de chaque opérateur).
 */
const LOGOS: Record<MoyenPaiement, string> = {
  WAVE: "/logo/wave.png",
  ORANGE_MONEY: "/logo/orange-money.jpg",
};

interface LogoMoyenPaiementProps {
  moyen: MoyenPaiement;
  libelle: string;
  className?: string;
}

/** Affiche le logo ; si le fichier est absent, le nom de l'opérateur le remplace */
export function LogoMoyenPaiement({ moyen, libelle, className = "size-10" }: LogoMoyenPaiementProps) {
  const [absent, setAbsent] = useState(false);

  if (absent) {
    return (
      <span
        className={`flex items-center justify-center rounded-lg bg-ink/5 px-1 text-center text-[10px] leading-tight font-bold text-ink/60 ${className}`}
        aria-hidden
      >
        {libelle}
      </span>
    );
  }

  return (
    <img
      src={LOGOS[moyen]}
      alt=""
      draggable={false}
      onError={() => setAbsent(true)}
      className={`rounded-lg object-contain ${className}`}
    />
  );
}