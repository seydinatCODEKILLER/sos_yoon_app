import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageSquare, Info } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { PhoneField } from "@/features/auth/components/PhoneField";
import {
  formatInternationalPhone,
  toInternationalPhone,
} from "@/features/auth/lib/phone";
import { authErrorMessage } from "@/features/auth/lib/authErrors";
import { toApiErreur } from "@/shared/lib/apiError";
import { toast } from "@/shared/lib/toast";
import {
  changerTelephoneSchema,
  type ChangerTelephoneValues,
} from "../schema/changerTelephone.schema";
import { useChangerTelephone } from "../hooks/useChangerTelephone";

interface Props {
  /** Numéro actuel, au format international */
  telephoneActuel: string;
  /** Appelé quand le code SMS est parti : numéro international + délai avant renvoi */
  onCodeEnvoye: (nouveauTelephone: string, delaiRenvoiSecondes: number) => void;
}

export function NouveauNumeroForm({ telephoneActuel, onCodeEnvoye }: Props) {
  const { demander, isDemandePending } = useChangerTelephone();

  const form = useForm<ChangerTelephoneValues>({
    resolver: zodResolver(changerTelephoneSchema),
    defaultValues: { telephone: "" },
  });
  const erreur = form.formState.errors.telephone;

  const onSubmit = form.handleSubmit(async (values) => {
    const nouveau = toInternationalPhone(values.telephone);

    // Le serveur répondrait « déjà utilisé par un autre compte » : on est plus clair
    if (nouveau === telephoneActuel) {
      form.setError("telephone", { message: "C'est déjà votre numéro actuel." });
      return;
    }

    try {
      const res = await demander(nouveau);
      toast.success(
        "Code de validation envoyé",
        `Un code a été envoyé au ${formatInternationalPhone(nouveau)}`,
      );
      onCodeEnvoye(nouveau, res.delaiRenvoiSecondes);
    } catch (e) {
      const err = toApiErreur(e);
      if (err.code === "TELEPHONE_DEJA_UTILISE" || err.code === "VALIDATION_ERREUR") {
        form.setError("telephone", { message: err.message });
      } else {
        toast.error(authErrorMessage(e));
      }
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <p className="text-[14px] leading-snug text-ink/60">
        Numéro actuel :{" "}
        <span className="font-semibold text-ink tabular-nums">
          {formatInternationalPhone(telephoneActuel)}
        </span>
      </p>

      <div className="mt-5 space-y-1.5">
        <Label htmlFor="nouveau-telephone" className="text-[15px] font-semibold text-navy">
          Nouveau numéro de téléphone
        </Label>
        <PhoneField
          id="nouveau-telephone"
          invalid={!!erreur}
          disabled={isDemandePending}
          {...form.register("telephone")}
        />
        {/* Hauteur réservée : pas de décalage quand l'erreur apparaît */}
        <p
          role={erreur ? "alert" : undefined}
          className={`min-h-5 text-sm ${erreur ? "text-red-600" : "text-ink/50"}`}
        >
          {erreur?.message ?? "Vous recevrez un code à usage unique par SMS."}
        </p>
      </div>

      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-ink/10 bg-ink/3 px-5 py-4">
        <Info className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden />
        <p className="text-[14px] leading-snug text-ink/70">
          Votre numéro actuel reste valable tant que le nouveau n'est pas
          confirmé. Une fois le changement fait, vous vous connecterez avec le
          nouveau numéro.
        </p>
      </div>

      <button
        type="submit"
        disabled={isDemandePending}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 text-[15px] font-semibold text-paper shadow-[0_8px_22px_rgba(249,97,13,0.32)] transition hover:brightness-105 disabled:opacity-60"
      >
        {isDemandePending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Envoi en cours…
          </>
        ) : (
          <>
            <MessageSquare className="size-4" aria-hidden /> Recevoir le code par SMS
          </>
        )}
      </button>
    </form>
  );
}