import { Link, useNavigate } from "react-router-dom";
import { VisiteurHeader } from "@/layouts/VisiteurHeader";
import { SosHero } from "@/features/demandes/components/SosHero";
import { Reassurance } from "@/features/demandes/components/Reassurance";
import { AssistantCard } from "@/shared/components/AssistantCard";

export function AccueilVisiteurPage() {
  const navigate = useNavigate();

  return (
    <>
      <VisiteurHeader />
      <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center px-5 pt-2 pb-4 md:mx-auto md:max-w-xl md:px-6">
        <div className="md:text-center">
          <p className="text-lg text-ink/55">
            Bonjour <span aria-hidden>👋</span>
          </p>
          <h1 className="mt-2 text-balance text-[28px] font-bold leading-[1.15] text-navy md:text-4xl">
            Quelle est votre urgence aujourd'hui ?
          </h1>
        </div>

        <SosHero compact onClick={() => navigate("/demandes/nouvelle")} />

        {/* Soxna Yoon : disponible avec ou sans compte */}
        <div className="mt-8">
          <AssistantCard />
        </div>

        {/* Mobile : le lien de connexion est ici (sur desktop, il est dans l'en-tête) */}
        <p className="mt-2 text-center text-[15px] text-ink/60 md:hidden">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center font-semibold text-signal underline-offset-4 hover:underline"
          >
            Se connecter
          </Link>
        </p>

        <Reassurance className="mt-6 hidden md:flex" />
      </main>
    </>
  );
}