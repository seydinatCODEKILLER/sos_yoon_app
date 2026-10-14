import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  visible?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  /** tiles : cases compactes centrées · boxes : cases étirées sur toute la largeur */
  variant?: "boxes" | "tiles";
}

export function CodeSecretInput({
  value, onChange, length = 4, visible = false, invalid, disabled,
  autoFocus, id, variant = "boxes",
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const handleChange = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    if (!d) return;
    onChange((value.slice(0, i) + d + value.slice(i + 1)).slice(0, length));
    focus(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) onChange(value.slice(0, i) + value.slice(i + 1));
      else if (i > 0) {
        onChange(value.slice(0, i - 1) + value.slice(i));
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft") focus(i - 1);
    else if (e.key === "ArrowRight") focus(i + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    onChange(digits);
    focus(digits.length >= length ? length - 1 : digits.length);
  };

  const tiles = variant === "tiles";

  return (
    <motion.div
      role="group"
      aria-label="Code secret"
      className={cn("flex gap-3", tiles ? "justify-center" : "justify-between")}
      animate={invalid ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      onPaste={handlePaste}
    >
      {Array.from({ length }, (_, i) => {
        const digit = value[i] ?? "";
        const filled = digit !== "";

        return (
          <div
            key={i}
            className={cn(
              "group/cell relative grid place-items-center rounded-2xl transition-all duration-150",
              tiles ? "size-14 shrink-0" : "h-16 flex-1",
              disabled && "opacity-60",
              invalid
                ? "bg-red-50 ring-2 ring-red-300"
                : cn(
                    filled
                      ? "bg-white shadow-sm ring-1 ring-ink/15"
                      : "bg-ink/4 ring-1 ring-ink/5",
                    "focus-within:bg-white focus-within:ring-2 focus-within:ring-signal focus-within:shadow-[0_0_0_4px_rgba(249,97,13,0.14)]",
                  ),
            )}
          >
            {/* Contenu visuel */}
            {filled ? (
              <motion.span
                key={visible ? `d-${digit}` : "p"}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                aria-hidden
                className={cn(
                  visible
                    ? "text-2xl font-semibold leading-none"
                    : "size-3 rounded-full",
                  invalid
                    ? visible ? "text-red-700" : "bg-red-600"
                    : visible ? "text-ink" : "bg-ink",
                )}
              >
                {visible ? digit : null}
              </motion.span>
            ) : (
              <>
                <span aria-hidden className="size-2 rounded-full bg-ink/15 group-focus-within/cell:hidden" />
                <span aria-hidden className="hidden h-6 w-0.5 animate-pulse rounded-full bg-signal group-focus-within/cell:block" />
              </>
            )}

            {/* Champ réel, invisible, au-dessus du rendu */}
            <input
              id={i === 0 ? id : undefined}
              ref={(el) => { refs.current[i] = el; }}
              autoFocus={autoFocus && i === 0}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={1}
              disabled={disabled}
              value={digit}
              aria-label={`Chiffre ${i + 1} du code secret`}
              aria-invalid={invalid}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className="absolute inset-0 size-full cursor-pointer rounded-2xl bg-transparent text-center opacity-0 outline-none"
            />
          </div>
        );
      })}
    </motion.div>
  );
}