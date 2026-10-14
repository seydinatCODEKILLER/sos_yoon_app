import { useState } from "react";
import { Link } from "react-router-dom";
import { Mic } from "lucide-react";

export function AssistantCard() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <Link
      to="/app/assistant"
      className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-xl bg-navy p-3.5 pr-4 text-left text-paper shadow-[0_10px_30px_-12px_rgba(23,22,48,0.6)] transition active:scale-[0.99]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-signal/20 blur-2xl"
      />

      <span className="relative shrink-0">
        <span className="grid size-14 place-items-center overflow-hidden rounded-full bg-white/10 text-sm font-semibold ring-2 ring-signal/70 ring-offset-2 ring-offset-navy">
          {imgOk ? (
            <img
              src="/images/soxna-yoon.png"
              alt=""
              onError={() => setImgOk(false)}
              className="size-full object-cover"
            />
          ) : (
            "SY"
          )}
        </span>
        <span
          aria-hidden
          className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-navy bg-emerald-400"
        />
      </span>

      <span className="relative min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-tight">
          Discuter avec Soxna Yoon
        </span>
        <span className="mt-1 block text-xs leading-snug text-paper/65">
          Posez vos questions juridiques à l'oral en Wolof ou Français
        </span>
      </span>

      <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-signal text-paper shadow-[0_6px_16px_rgba(249,97,13,0.45)] transition-transform group-hover:scale-105">
        <Mic className="size-4.5" aria-hidden />
      </span>
    </Link>
  );
}