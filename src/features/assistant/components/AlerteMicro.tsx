import { Loader2, TriangleAlert } from "lucide-react";

interface AlerteMicroProps {
  etat: "bloque" | "indisponible";
  onAutoriser: () => void;
  occupe: boolean;
}

export function AlerteMicro({ etat, onAutoriser, occupe }: AlerteMicroProps) {
  const bloque = etat === "bloque";

  return (
    <div
      role="status"
      className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-4"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-300/15 text-amber-300"
        >
          <TriangleAlert className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-amber-300">
            {bloque ? "Microphone bloqué" : "Microphone indisponible"}
          </p>
          <p className="mt-1 text-[14px] leading-snug text-paper/80">
            {bloque
              ? "Le micro est bloqué. Autorisez-le dans les réglages de votre navigateur, ou écrivez votre message."
              : "Le micro n'est pas disponible sur cet appareil ou dans ce navigateur. Vous pouvez écrire votre message."}
          </p>
          {bloque && (
            <button
              type="button"
              onClick={onAutoriser}
              disabled={occupe}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-amber-400 px-5 text-[14px] font-semibold text-navy transition hover:bg-amber-300 disabled:opacity-60"
            >
              {occupe && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Autoriser le micro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}