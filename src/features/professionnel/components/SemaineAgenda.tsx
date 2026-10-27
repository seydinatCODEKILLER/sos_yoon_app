import { motion } from "motion/react";
import { conteneur } from "@/shared/lib/animationsPage";
import { cleJour, enteteJour } from "../lib/agenda";
import type { RendezVous } from "../types/agenda.types";
import { CarteRendezVous } from "./CarteRendezVous";

interface SemaineAgendaProps {
  jours: Date[];
  parJour: Record<string, RendezVous[]>;
  aujourdhui: string;
  maintenant: number;
  onOuvrir: (rdv: RendezVous) => void;
}

export function SemaineAgenda({ jours, parJour, aujourdhui, maintenant, onOuvrir }: SemaineAgendaProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {jours.map((jour) => {
        const cle = cleJour(jour);
        const evenements = parJour[cle] ?? [];
        const estAujourdhui = cle === aujourdhui;
        const entete = enteteJour(jour);

        return (
          <section
            key={cle}
            aria-label={`${entete.court} ${entete.date}`}
            className={`flex min-h-24 flex-col gap-2 rounded-xl border p-2 lg:min-h-72 ${
              estAujourdhui
                ? "border-signal/40 bg-linear-to-b from-signal/8 to-white"
                : "border-ink/10 bg-linear-to-br from-white to-navy/5"
            }`}
          >
            <header className="px-1 pt-1 text-center lg:text-center">
              <p
                className={`text-[10px] font-bold tracking-wide uppercase ${
                  estAujourdhui ? "text-signal" : "text-ink/50"
                }`}
              >
                {estAujourdhui ? "Aujourd'hui" : entete.court}
              </p>
              <p className="text-sm font-bold text-ink">{entete.date}</p>
            </header>

            {evenements.length === 0 ? (
              <p className="px-1 py-2 text-center text-[11px] text-ink/35">Aucun rendez-vous</p>
            ) : (
              <motion.ul variants={conteneur} className="space-y-2">
                {evenements.map((rdv) => (
                  <CarteRendezVous key={rdv.id} rdv={rdv} maintenant={maintenant} onOuvrir={onOuvrir} />
                ))}
              </motion.ul>
            )}
          </section>
        );
      })}
    </div>
  );
}