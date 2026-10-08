import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AuthVisualPanel } from "@/shared/components/AuthVisualPanel";
import { RegisterProfessionnelForm } from "../components/RegisterProfessionnelForm";

export function RegisterProfessionnelPage() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-dvh bg-paper md:grid-cols-2">
      <div className="hidden md:sticky md:top-0 md:block md:h-dvh">
        <AuthVisualPanel
          title="Rejoignez le réseau, recevez des demandes qualifiées."
          subtitle="Recevez des demandes correspondant à votre spécialité et à votre zone d'intervention, dès que votre inscription est validée."
        />
      </div>

      <div className="flex min-h-dvh flex-col px-6 py-6 md:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/login" className="font-display text-base text-ink md:hidden">
              SOS Yoon
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-medium text-navy/70 sm:flex">
              <ShieldCheck className="size-3.5 text-emerald-600" strokeWidth={1.75} />
              Données chiffrées &amp; confidentielles
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-medium text-ink/70 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            Retour
          </button>
        </header>

        <main className="flex flex-1 items-center py-10">
          <RegisterProfessionnelForm />
        </main>
      </div>
    </div>
  );
}