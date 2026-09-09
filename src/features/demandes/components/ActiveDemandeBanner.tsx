import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Radio } from "lucide-react";
import type { Demande } from "../types/demande.types";

interface ActiveDemandeBannerProps {
  demande: Demande;
}

export function ActiveDemandeBanner({ demande }: ActiveDemandeBannerProps) {
  return (
    <Link to={`/app/demandes/${demande.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between gap-4 rounded-2xl border border-signal/30 bg-signal/5 px-5 py-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal/15">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/30" />
            <Radio size={14} className="relative text-signal" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">
              Une demande est en cours
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {demande.descriptionTexte ?? "Message vocal"}
            </p>
          </div>
        </div>
        <ArrowRight size={16} className="shrink-0 text-signal" />
      </motion.div>
    </Link>
  );
}