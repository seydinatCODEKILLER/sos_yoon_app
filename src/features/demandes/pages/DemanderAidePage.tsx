import { useState } from "react";
import { Mic } from "lucide-react";
import type { TypeSaisie } from "../types/demande.types";
import { MessageEcritForm } from "../components/MessageEcritForm";
import { MessageVocalPanel } from "../components/MessageVocalPanel";
import { TypeSaisieTabs } from "../components/TypeSaisieTabs";

export function DemanderAidePage() {
  const [type, setType] = useState<TypeSaisie>("VOCAL");

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-3xl flex-col px-5 pb-6 pt-2 md:min-h-0 md:px-10 md:pb-12 md:pt-10">
      <header className="text-left md:text-center">
        <h2 className="text-balance text-[28px] font-bold leading-tight text-navy md:text-[34px]">
          Racontez votre situation
        </h2>
        {/* min-h-11 : réserve 2 lignes sur mobile, pas de décalage au changement de mode */}
        <p className="mt-2 min-h-11 text-[15px] leading-snug text-ink/60 md:mx-auto md:min-h-0 md:max-w-xl">
          {type === "VOCAL" ? (
            <>
              Parlez dans votre langue, français ou wolof.{" "}
              <span className="block md:inline">
                Quelques minutes suffisent.
              </span>
            </>
          ) : (
            "Écrivez avec vos mots, en français ou en wolof."
          )}
        </p>
      </header>

      {/* Onglets : desktop uniquement */}
      <div className="mt-4 hidden justify-center md:mt-6 md:flex">
        <TypeSaisieTabs value={type} onChange={setType} />
      </div>

      {/* Les deux panneaux restent montés : changer de mode ne fait pas perdre le texte saisi */}
      <div
        role="tabpanel"
        id="panel-VOCAL"
        aria-labelledby="tab-VOCAL"
        hidden={type !== "VOCAL"}
        className="mt-2 flex flex-1 flex-col md:mt-8"
      >
        <MessageVocalPanel
          active={type === "VOCAL"}
          onWrite={() => setType("TEXTE")}
        />
      </div>

      <div
        role="tabpanel"
        id="panel-TEXTE"
        aria-labelledby="tab-TEXTE"
        hidden={type !== "TEXTE"}
        className="mt-2 text-left md:mt-8"
      >
        <button
          type="button"
          onClick={() => setType("VOCAL")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-signal md:hidden"
        >
          <Mic className="size-4" aria-hidden />
          Parler plutôt qu'écrire
        </button>
        <MessageEcritForm />
      </div>
    </div>
  );
}