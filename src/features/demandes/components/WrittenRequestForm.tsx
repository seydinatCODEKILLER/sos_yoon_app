import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useGeolocation } from "../hooks/useGeolocation";
import { motion } from "motion/react";

import { useSubmitWrittenRequest } from "../hooks/useSubmitWrittenRequest";
import { useWrittenDraftStore } from "../store/writtenDraft.store";
import {
  writtenRequestSchema,
  type WrittenRequestValues,
} from "../schema/writtenRequest.schema";
import type { Metier } from "@/types/user.types";

type LocationState = { metier?: Metier };

export function WrittenRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { metier } = (location.state as LocationState) ?? {};

  const { isAuthenticated } = useAuthStore();
  const setDraft = useWrittenDraftStore((s) => s.setDraft);
  const { position, status: geoStatus, requestPosition } = useGeolocation();
  const { submit, isSubmitting } = useSubmitWrittenRequest();
  const [positionTouched, setPositionTouched] = useState(false);

  const form = useForm<WrittenRequestValues>({
    resolver: zodResolver(writtenRequestSchema),
    defaultValues: { message: "" },
  });

  if (!metier) {
    return <Navigate to="/demande/ecrit/metier" replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setPositionTouched(true);
    if (!position) return;

    if (!isAuthenticated) {
      setDraft({ message: values.message, metier, position });
      navigate("/demande/telephone", {
        state: { pendingAction: "writtenRequest" },
      });
      return;
    }

    const ok = await submit({ message: values.message, metier, position });
    if (ok) navigate("/app/demandes/suivi");
  });

  const showPositionError = positionTouched && !position;

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium text-ink/70">
          Décrivez votre situation
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Expliquez votre urgence en quelques phrases…"
          className="w-full resize-none rounded-2xl border border-ink/15 bg-white p-4 text-sm text-ink placeholder:text-ink/40 focus-visible:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/30"
          {...form.register("message")}
        />
        {form.formState.errors.message && (
          <p className="text-sm text-red-600">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <button
          type="button"
          onClick={requestPosition}
          disabled={geoStatus === "loading" || !!position}
          className={`group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-4 text-left transition-all ${
            position
              ? "border-signal/30 bg-signal/5"
              : "border-dashed border-ink/20 bg-white hover:border-signal/50 hover:bg-signal/5"
          } ${geoStatus === "loading" ? "cursor-wait" : ""}`}
        >
          <span
            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
              position ? "bg-signal text-paper" : "bg-brass/10 text-brass"
            }`}
          >
            {geoStatus === "loading" && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-brass/30 border-t-brass"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            )}
            {position ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
          </span>

          <span className="flex flex-col">
            <span className="text-sm font-medium text-ink/80">
              {geoStatus === "loading" && "Localisation en cours…"}
              {geoStatus !== "loading" && position && "Position partagée"}
              {geoStatus !== "loading" && !position && "Partager ma position"}
            </span>
            <span className="text-xs text-ink/40">
              {position
                ? "Le professionnel le plus proche sera contacté"
                : "Nécessaire pour trouver un professionnel proche de vous"}
            </span>
          </span>
        </button>

        {geoStatus === "denied" && (
          <p className="text-sm text-red-600">
            Autorisez l'accès à votre position dans les réglages du navigateur
            pour continuer.
          </p>
        )}
        {showPositionError && geoStatus !== "denied" && (
          <p className="text-sm text-red-600">
            Partagez votre position pour continuer.
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !position}
        className="h-12 w-full gap-2 rounded-xl bg-signal text-base font-medium text-paper hover:bg-signal hover:brightness-105 disabled:opacity-60"
      >
        {isSubmitting ? (
          "Envoi…"
        ) : (
          <>
            <Send className="h-4 w-4" />
            Envoyer ma demande
          </>
        )}
      </Button>
    </form>
  );
}
