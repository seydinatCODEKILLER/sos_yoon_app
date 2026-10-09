import { useState } from "react";
import { Clock, Languages } from "lucide-react";
import type { TypeSaisie } from "../types/demande.types";
import { MessageEcritForm } from "../components/MessageEcritForm";
import { MessageVocalPanel } from "../components/MessageVocalPanel";
import { TypeSaisieTabs } from "../components/DemandeListSkeleton";

export function DemanderAidePage() {
  const [type, setType] = useState<TypeSaisie>("TEXTE");

  return (
    <div className="w-full max-w-5xl px-6 pb-28 pt-10 md:px-10 md:pb-12">
      <header>
        <h2 className="font-display text-3xl font-bold text-navy sm:text-[34px]">
          Demander de l'aide
        </h2>
        <p className="mt-2 text-[15px] text-ink/60">
          Décrivez votre situation et SOS Yoon vous orientera vers le professionnel adapté.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-xs text-ink/70">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1">
            <Clock className="size-3.5 text-signal" aria-hidden /> Quelques minutes suffisent
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1">
            <Languages className="size-3.5 text-signal" aria-hidden /> Parlez dans votre langue
            (Français, Wolof…)
          </li>
        </ul>
      </header>

      <div className="mt-6">
        <TypeSaisieTabs value={type} onChange={setType} />
      </div>

      {/* Les deux panneaux restent montés : changer d'onglet ne fait pas perdre le texte saisi */}
      <div
        role="tabpanel"
        id="panel-TEXTE"
        aria-labelledby="tab-TEXTE"
        hidden={type !== "TEXTE"}
        className="mt-8"
      >
        <MessageEcritForm />
      </div>
      <div
        role="tabpanel"
        id="panel-VOCAL"
        aria-labelledby="tab-VOCAL"
        hidden={type !== "VOCAL"}
        className="mt-8"
      >
        <MessageVocalPanel active={type === "VOCAL"} onWrite={() => setType("TEXTE")} />
      </div>
    </div>
  );
}