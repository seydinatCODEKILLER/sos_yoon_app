import { useState, type ReactNode } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { INPUT_CLASS } from "../lib/registerFormHelpers";

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  upper?: boolean;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  upper,
  children,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className={
          upper
            ? "text-[11px] font-semibold uppercase tracking-wide text-navy/60"
            : "text-[13px] font-medium text-ink"
        }
      >
        {label}
        {required && <span className="ml-0.5 text-signal">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-navy/40">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={`${INPUT_CLASS} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute inset-y-0 right-3 flex items-center text-navy/40 hover:text-navy/70"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

interface ToggleChipProps {
  selected: boolean;
  onClick: () => void;
  shape?: "square" | "circle";
  children: ReactNode;
}

export function ToggleChip({
  selected,
  onClick,
  shape = "square",
  children,
}: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-10 items-center justify-between gap-2 rounded-lg border px-3 text-left text-xs font-medium transition-colors ${
        selected
          ? "border-signal bg-signal/5 text-ink"
          : "border-ink/10 bg-white text-navy/60 hover:border-ink/25"
      }`}
    >
      <span className="truncate">{children}</span>
      <span
        className={`flex size-4 shrink-0 items-center justify-center border ${
          shape === "circle" ? "rounded-full" : "rounded"
        } ${selected ? "border-signal bg-signal text-white" : "border-ink/20"}`}
      >
        {selected && <Check className="size-3" strokeWidth={3} />}
      </span>
    </button>
  );
}