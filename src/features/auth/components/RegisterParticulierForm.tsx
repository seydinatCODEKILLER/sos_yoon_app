import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  registerParticulierSchema,
  type RegisterParticulierValues,
} from "../schema/registerParticulier.schema";
import { useRegisterParticulier } from "../hooks/useRegisterParticulier";
import { useNavigate } from "react-router-dom";

export function RegisterParticulierForm() {
  const navigate = useNavigate();
  const { submit, isSubmitting } = useRegisterParticulier();

  const form = useForm<RegisterParticulierValues>({
    resolver: zodResolver(registerParticulierSchema),
    defaultValues: { telephone: "" },
  });

    const onSubmit = form.handleSubmit(async (values) => {
    const ok = await submit(values);
    if (ok) {
      navigate("/verification-otp", { state: { telephone: values.telephone } });
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="telephone" className="text-sm text-ink/70">
          Numéro de téléphone
        </Label>
        <Input
          id="telephone"
          type="tel"
          autoComplete="tel"
          placeholder="77 123 45 67"
          className="h-12 border-ink/15 bg-white px-4 text-base focus-visible:border-signal focus-visible:ring-signal/30"
          {...form.register("telephone")}
        />
        {form.formState.errors.telephone && (
          <p className="text-sm text-red-600">
            {form.formState.errors.telephone.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full gap-2 rounded-xl bg-signal text-base font-medium text-paper hover:bg-signal hover:brightness-105 disabled:opacity-60"
      >
        {isSubmitting ? (
          "Envoi en cours…"
        ) : (
          <>
            <MessageSquare className="h-4 w-4" />
            Recevoir mon code de validation
          </>
        )}
      </Button>
    </form>
  );
}