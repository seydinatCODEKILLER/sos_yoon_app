import { motion } from "motion/react";
import { Lock, Radar } from "lucide-react";

const etapes = [
  {
    titre: "Analyse de votre demande",
    description: "Identification du métier et de la spécialité",
  },
  {
    titre: "Recherche du professionnel",
    description: "Disponibilité et proximité",
  },
  {
    titre: "Mise en relation",
    description: "Messagerie sécurisée",
  },
];

export function DemandeInfoPanel() {
  return (
    <div className="bg-paper/60 p-6 sm:p-7">
      <div className="flex items-center gap-2">
        <Radar size={14} className="text-signal" />
        <h2 className="text-sm font-semibold text-ink">Ce qui va se passer</h2>
      </div>

      <ol className="relative mt-5 space-y-6">
        <div className="absolute left-2.5 top-1 bottom-1 w-px bg-border" />

        {etapes.map((etape, i) => (
          <motion.li
            key={etape.titre}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="relative flex gap-3"
          >
            <span
              className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
                i === 0 ? "bg-signal text-ink" : "bg-ink text-paper"
              }`}
            >
              {i === 0 ? (
                <span className="relative flex h-full w-full items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-50" />
                  <span className="relative">{i + 1}</span>
                </span>
              ) : (
                i + 1
              )}
            </span>
            <div>
              <p className="text-sm font-medium text-ink">{etape.titre}</p>
              <p className="text-xs text-muted-foreground">
                {etape.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-border bg-white px-3.5 py-3">
        <p className="text-xs text-muted-foreground">
          Les professionnels disponibles à proximité sont notifiés
          automatiquement dès l'envoi de votre demande.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <Lock size={13} />
        Données chiffrées, professionnels vérifiés
      </div>
    </div>
  );
}
