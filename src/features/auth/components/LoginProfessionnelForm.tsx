import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  loginProfessionnelSchema,
  type LoginProfessionnelValues,
} from "../schema/loginProfessionnel.schema";
import { useLoginProfessionnel } from "../hooks/useLoginProfessionnel";

export function LoginProfessionnelForm() {
  const { submit, isSubmitting } = useLoginProfessionnel();

  const form = useForm<LoginProfessionnelValues>({
    resolver: zodResolver(loginProfessionnelSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit((values) => submit(values));

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm text-ink/70">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@cabinet.sn"
          className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm text-ink/70">
            Mot de passe
          </Label>
          <button
            type="button"
            className="text-xs font-medium text-brass hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full gap-2 rounded-xl bg-signal text-sm font-medium text-paper hover:bg-signal hover:brightness-105 disabled:opacity-60"
      >
        {isSubmitting ? (
          "Connexion en cours…"
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Se connecter
          </>
        )}
      </Button>
    </form>
  );
}
