import type { KeyboardEvent } from "react";
import { Mic, PenLine } from "lucide-react";
import type { TypeSaisie } from "../types/demande.types";

const TABS = [
  { value: "TEXTE", label: "Message écrit", icon: PenLine },
  { value: "VOCAL", label: "Message vocal", icon: Mic },
] as const;

interface TypeSaisieTabsProps {
  value: TypeSaisie;
  onChange: (value: TypeSaisie) => void;
}

export function TypeSaisieTabs({ value, onChange }: TypeSaisieTabsProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next: TypeSaisie = value === "TEXTE" ? "VOCAL" : "TEXTE";
    onChange(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Type de message"
      onKeyDown={handleKeyDown}
      className="inline-flex gap-1 rounded-2xl bg-ink/5 p-1.5"
    >
      {TABS.map(({ value: tab, label, icon: Icon }) => {
        const selected = tab === value;
        return (
          <button
            key={tab}
            id={`tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${tab}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal/50 ${
              selected
                ? "bg-signal text-paper shadow-[0_4px_14px_rgba(249,97,13,0.3)]"
                : "text-ink/70 hover:text-ink"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}