import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Mic,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useCreateDemande } from "../hooks/useCreateDemande";
import {
  createDemandeSchema,
  type CreateDemandeFormValues,
} from "../schema/demande.schema";
import { getErrorMessage } from "@/shared/lib/errorHandler";
import { toast } from "@/shared/lib/toast";
import { LocationShareCard } from "./LocationShareCard";

type InputMode = "texte" | "vocal";

const MAX_LENGTH = 2000;

export function NewDemandeForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<InputMode>("texte");
  const geolocation = useGeolocation();
  const createDemande = useCreateDemande();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateDemandeFormValues>({
    resolver: zodResolver(createDemandeSchema),
  });

  const descriptionValue = watch("descriptionTexte") ?? "";
  const charCount = descriptionValue.length;
  const nearLimit = charCount > MAX_LENGTH * 0.85;

  const onSubmit = (values: CreateDemandeFormValues) => {
    createDemande.mutate(
      {
        descriptionTexte: values.descriptionTexte,
        latitude: geolocation.latitude ?? undefined,
        longitude: geolocation.longitude ?? undefined,
      },
      {
        onSuccess: (demande) => {
          toast.success("Demande envoyée, analyse en cours");
          navigate(`/app/demandes/${demande.id}`);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Toggle Texte / Vocal */}
      <div className="relative grid grid-cols-2 gap-1 rounded-xl bg-paper p-1">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-ink"
          style={{ left: mode === "texte" ? "4px" : "calc(50% + 0px)" }}
        />
        <button
          type="button"
          onClick={() => setMode("texte")}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            mode === "texte" ? "text-paper" : "text-muted-foreground"
          }`}
        >
          <FileText size={15} />
          Texte
        </button>
        <button
          type="button"
          onClick={() => setMode("vocal")}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            mode === "vocal" ? "text-paper" : "text-muted-foreground"
          }`}
        >
          <Mic size={15} />
          Vocal
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5">
        <AnimatePresence mode="wait">
          {mode === "texte" ? (
            <motion.div
              key="texte"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <Textarea
                  rows={7}
                  maxLength={MAX_LENGTH}
                  placeholder="Ex. Mon propriétaire veut m'expulser sans préavis..."
                  className="resize-none border-border bg-paper pb-7 transition-colors focus-visible:border-signal focus-visible:ring-signal/20"
                  {...register("descriptionTexte")}
                />
                <span
                  className={`pointer-events-none absolute bottom-2.5 right-3 text-[11px] tabular-nums ${
                    nearLimit ? "text-signal" : "text-muted-foreground/60"
                  }`}
                >
                  {charCount}/{MAX_LENGTH}
                </span>
              </div>
              {errors.descriptionTexte && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.descriptionTexte.message}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="vocal"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-paper py-14 text-center"
            >
              <div className="flex items-end gap-0.5">
                {[6, 12, 8, 14, 7].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-1 rounded-full bg-muted-foreground/30"
                    style={{ height: h }}
                    animate={{ scaleY: [1, 1.6, 1] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-ink">
                Message vocal — bientôt disponible
              </p>
              <p className="max-w-52 text-xs text-muted-foreground">
                En attendant, décrivez votre situation par écrit.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Géolocalisation */}
        <div className="mt-4">
          <LocationShareCard geolocation={geolocation} />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Aide le professionnel trouvé à évaluer la proximité — optionnel.
        </p>

        <Button
          type="submit"
          disabled={mode === "vocal" || createDemande.isPending}
          className="mt-5 w-full bg-signal text-ink hover:bg-signal/90"
        >
          {createDemande.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer ma demande
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
