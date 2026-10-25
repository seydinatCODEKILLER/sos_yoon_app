import { useNavigate } from "react-router-dom";
import { VisiteurHeader } from "@/layouts/VisiteurHeader";
import { SosHero } from "@/features/demandes/components/SosHero";
import { AssistantCard } from "@/shared/components/AssistantCard";
import { LienInscription, LienConnexion } from "@/shared/components/LienConnexion";

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
        {/* Compte : inscription et connexion (mobile ; sur web, ils sont dans l'en-tête) */}
        <div className="mt-6 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:hidden">
          <LienInscription variant="bloc" />
          <LienConnexion variant="bloc" />
        </div>

        {/* <Reassurance className="mt-6 hidden md:flex" /> */}
      </main>
    </>
  );
}