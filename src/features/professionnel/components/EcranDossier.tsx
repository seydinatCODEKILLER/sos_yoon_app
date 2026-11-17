import type { CSSProperties, ReactNode } from "react";
import { Illustration, type Scene } from "./Illustration";

/** Même fond bleu nuit que le bandeau des pages de connexion */
const FOND_PANNEAU: CSSProperties = {
  backgroundColor: "#171630",
  backgroundImage: [
    "radial-gradient(90% 70% at 100% 0%, rgba(255,255,255,0.07) 0%, transparent 60%)",
    "radial-gradient(70% 60% at 0% 100%, rgba(249,97,13,0.16) 0%, transparent 65%)",
    "linear-gradient(180deg, #1c1b3d 0%, #171630 60%, #12112a 100%)",
  ].join(", "),
};

/**
 * Écran plein cadre des pages du dossier professionnel :
 * un panneau bleu nuit avec une illustration de l'état, et le contenu à droite, sans encadré.
 */
export function EcranDossier({
  scene,
  legende,
  children,
}: {
  scene: Scene;
  /** Petit texte en bas du panneau */
  legende: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] bg-paper lg:grid-cols-2 lg:grid-rows-1">
      <div
        className="flex min-w-0 flex-col justify-between px-6 py-6 text-paper sm:px-10 sm:py-8 lg:sticky lg:top-0 lg:h-dvh lg:px-14 lg:py-10"
        style={FOND_PANNEAU}
      >
        <img src="/images/logo-blanc.svg" alt="SOS Yoon" className="h-4 w-auto self-start" />

        <div className="flex flex-1 items-center py-6 lg:justify-center lg:py-8">
          <Illustration scene={scene} className="w-44 sm:w-60 lg:w-[min(100%,28rem)]" />
        </div>

        <p className="text-sm text-paper/70">{legende}</p>
      </div>

      <main className="flex min-w-0 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}

export function Titre({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
      {children}
    </h1>
  );
}

/** Bloc séparé du reste par un simple filet : remplace les encadrés */
export function Section({ children }: { children: ReactNode }) {
  return <section className="mt-10 border-t border-ink/15 pt-6">{children}</section>;
}

/** Petit mot de fin de page */
export function PiedPage({ texte }: { texte: string }) {
  return (
    <p className="mt-10 border-t border-ink/15 pt-6 text-sm leading-relaxed text-ink/55">
      {texte}
    </p>
  );
}

/** Bouton plein, angles droits : même forme pour tous les appels à l'action */
export const ACTION =
  "inline-flex h-12 w-full items-center justify-center gap-3 rounded-none bg-navy px-6 text-sm font-semibold text-paper shadow-none transition-colors hover:bg-signal sm:w-auto disabled:opacity-60";