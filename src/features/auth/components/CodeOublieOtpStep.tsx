import { AuthSubtitle, AuthTitle } from "@/shared/components/AuthShell";
import { maskPhone } from "../lib/maskPhone";
import { OtpForm } from "./OtpForm";

interface Props {
  telephone: string;
  onEdit: () => void;
  onVerified: (jetonReinitialisation: string) => void;
}

export function CodeOublieOtpStep({ telephone, onEdit, onVerified }: Props) {
  return (
    <div>
      <div className="text-left md:text-center">
        <AuthTitle>Vérifiez votre numéro</AuthTitle>
        <AuthSubtitle>
          Entrez le code à 6 chiffres envoyé au{" "}
          <span className="font-semibold text-ink">{maskPhone(telephone)}</span>.
        </AuthSubtitle>
        <button
          type="button"
          onClick={onEdit}
          className="mt-2 text-sm font-medium text-ink underline underline-offset-4 hover:text-signal"
        >
          Modifier le numéro
        </button>
      </div>

      <div className="mt-6">
        <OtpForm
          telephone={telephone}
          type="REINITIALISATION"
          variant="reset"
          onVerified={onVerified}
        />
      </div>
    </div>
  );
}