import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AssistantCard } from "@/shared/components/AssistantCard";
import { Reassurance } from "../components/Reassurance";
import { SosHero } from "../components/SosHero";

export function UserHomePage() {
  const navigate = useNavigate();
  const prenom = useAuthStore((s) => s.user?.prenom);

  return (
    <div className="flex min-h-[calc(100dvh-8.5rem)] flex-col px-5 pb-4 pt-2 md:mx-auto md:min-h-[calc(100dvh-3.5rem)] md:max-w-xl md:justify-center md:px-6">
      {/* Salutation */}
      <div className="md:text-center">
        <p className="text-lg text-ink/55">
          Bonjour{prenom ? ` ${prenom}` : ""} <span aria-hidden>👋</span>
        </p>
        <h2 className="mt-2 text-balance text-[28px] font-bold leading-[1.15] text-navy md:text-4xl">
          Quelle est votre urgence aujourd'hui ?
        </h2>
      </div>

      <SosHero onClick={() => navigate("/app/demandes/nouvelle")} />

      {/* Soxna Yoon */}
      <AssistantCard />

      {/* Réassurance (desktop) */}
      <Reassurance className="mt-6 hidden md:flex" />
    </div>
  );
}