import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { CircleAlert, Eye, EyeOff, LogIn } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import {
  loginParticulierSchema,
  type LoginParticulierValues,
} from "../schema/loginParticulier.schema";
import { useLoginParticulier } from "../hooks/useLoginParticulier";
import { CodeSecretInput } from "./CodeSecretInput";
import { getRouteForSession } from "@/shared/lib/getPostLoginRoute";
import { PhoneField } from "./PhoneField";

export function LoginParticulierForm() {
  const navigate = useNavigate();
  const { submit, isSubmitting, serverError, clearError } =
    useLoginParticulier();
  const [codeVisible, setCodeVisible] = useState(false);

  const form = useForm<LoginParticulierValues>({
    resolver: zodResolver(loginParticulierSchema),
    defaultValues: { telephone: "", codeSecret: "" },
  });
  const errors = form.formState.errors;

  const onSubmit = form.handleSubmit(async (values) => {
    const session = await submit(values);
    if (session) {
      navigate(getRouteForSession(session.utilisateur.role, session.portee), {
        replace: true,
      });
    }
  });

  const codeInvalide = !!serverError || !!errors.codeSecret;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full space-y-5">
      {/* Téléphone */}
      <div className="space-y-1.5">
        <Label htmlFor="telephone" className="text-sm font-medium text-ink">
          Numéro de téléphone
        </Label>
        <PhoneField
          id="telephone"
          invalid={!!errors.telephone}
          {...form.register("telephone", { onChange: clearError })}
        />
        {errors.telephone && (
          <p role="alert" className="text-sm text-red-600">
            {errors.telephone.message}
          </p>
        )}
      </div>

      {/* Code secret */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="codeSecret" className="text-sm font-medium text-ink">
            Code secret
          </Label>
          <button
            type="button"
            onClick={() => setCodeVisible((v) => !v)}
            aria-label={codeVisible ? "Masquer le code" : "Afficher le code"}
            className="text-ink/50 hover:text-ink"
          >
            {codeVisible ? (
              <Eye className="size-5" />
            ) : (
              <EyeOff className="size-5" />
            )}
          </button>
        </div>

        <Controller
          control={form.control}
          name="codeSecret"
          render={({ field }) => (
            <CodeSecretInput
              id="codeSecret"
              value={field.value}
              onChange={(v) => {
                clearError();
                field.onChange(v);
              }}
              visible={codeVisible}
              invalid={codeInvalide}
              disabled={isSubmitting}
            />
          )}
        />

        {(serverError || errors.codeSecret) && (
          <p
            role="alert"
            className="flex items-center gap-1.5 text-sm text-red-700"
          >
            <CircleAlert className="size-4 shrink-0" aria-hidden />
            {serverError ?? errors.codeSecret?.message}
          </p>
        )}

        <div className="text-right">
          <Link
            to="/code-oublie"
            className="text-sm font-semibold text-ink hover:underline"
          >
            Code oublié ?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-paper shadow-[0_8px_20px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-60"
      >
        <LogIn className="size-4" aria-hidden />
        {isSubmitting ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
