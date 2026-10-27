import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition } from "@/shared/lib/animationsPage";

interface CarteStatProps {
  titre: string;
  valeur: string | null;
  icone: LucideIcon;
  teinte: string;
  pied: ReactNode;
}

export function CarteStat({ titre, valeur, icone: Icone, teinte, pied }: CarteStatProps) {
  return (
    <motion.div variants={apparition}>
      <Card className={`${CARTE} h-full py-0`}>
        <CardContent className="flex min-h-32 flex-col justify-between gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wide text-ink/60 uppercase">
              {titre}
            </p>
            <span className={`grid size-8 place-items-center rounded-lg ${teinte}`}>
              <Icone className="size-4" aria-hidden />
            </span>
          </div>
          <div>
            {valeur === null ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-ink/10" />
            ) : (
              <p className="text-3xl font-bold tracking-tight text-ink">{valeur}</p>
            )}
            <div className="mt-1.5 flex min-h-6 flex-wrap items-center gap-2 text-xs text-ink/60">
              {pied}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}