import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/shared/lib/toast";
import { toApiErreur } from "@/shared/lib/apiError";
import { CodeSecretInput } from "@/features/auth/components/CodeSecretInput";
import {
  changerCodeSecretSchema,
  type ChangerCodeSecretValues,
} from "../schema/changerCodeSecret.schema";
import { useChangerCodeSecret } from "../hooks/useChangerCodeSecret";
import { codeSecretErrorMessage } from "../lib/codeSecretErrors";
import { profilRoutes } from "../lib/profilRoutes";

interface ChampCodeProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  erreur?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

function ChampCode({
  label,
  value,
  onChange,
  erreur,
  autoFocus,
  disabled,
}: ChampCodeProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-semibold text-navy">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <CodeSecretInput
            id={id}
            value={value}
            onChange={onChange}
            visible={visible}
            invalid={!!erreur}
            disabled={disabled}
            autoFocus={autoFocus}
          />
        </div>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le code" : "Afficher le code"}
          aria-pressed={visible}
          className="grid size-10 shrink-0 place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
      {/* Espace réservé : pas de décalage quand un message apparaît */}
      <p
        role={erreur ? "alert" : undefined}
        className="mt-1.5 min-h-5 text-sm text-red-600"
      >
        {erreur}
      </p>
    </div>
  );
}

export function ChangerCodeSecretForm() {
  const navigate = useNavigate();
  const { changer, isPending } = useChangerCodeSecret();

  const form = useForm<ChangerCodeSecretValues>({
    resolver: zodResolver(changerCodeSecretSchema),
    defaultValues: { codeActuel: "", nouveauCode: "", confirmation: "" },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await changer({
        codeActuel: values.codeActuel,
        nouveauCode: values.nouveauCode,
      });
      toast.success("Code secret modifié.");
      navigate(profilRoutes.accueil, { replace: true });
    } catch (e) {
      const message = codeSecretErrorMessage(e);
      if (toApiErreur(e).code === "CODE_SECRET_INCORRECT") {
        form.setValue("codeActuel", "");
        form.setError("codeActuel", { message });
      } else {
        toast.error(message);
      }
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col gap-1">
      <Controller
        control={form.control}
        name="codeActuel"
        render={({ field }) => (
          <ChampCode
            label="Code actuel"
            value={field.value}
            onChange={field.onChange}
            erreur={errors.codeActuel?.message}
            disabled={isPending}
            autoFocus
          />
        )}
      />
      <Controller
        control={form.control}
        name="nouveauCode"
        render={({ field }) => (
          <ChampCode
            label="Nouveau code"
            value={field.value}
            onChange={field.onChange}
            erreur={errors.nouveauCode?.message}
            disabled={isPending}
          />
        )}
      />
      <Controller
        control={form.control}
        name="confirmation"
        render={({ field }) => (
          <ChampCode
            label="Confirmer le nouveau code"
            value={field.value}
            onChange={field.onChange}
            erreur={errors.confirmation?.message}
            disabled={isPending}
          />
        )}
      />

      <button
        type="submit"
        disabled={isPending}
        className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 text-[15px] font-semibold text-paper shadow-[0_8px_22px_rgba(249,97,13,0.32)] transition hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enregistrement…
          </>
        ) : (
          "Enregistrer mon nouveau code"
        )}
      </button>
    </form>
  );
}