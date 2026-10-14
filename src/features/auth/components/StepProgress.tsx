import { cn } from "@/shared/lib/utils";

interface Props {
  step: number;
  total?: number;
  /** Libellé à droite (remplacé par « 100% » à la dernière étape) */
  label: string;
}

export function StepProgress({ step, total = 3, label }: Props) {
  return (
    <div aria-label={`Étape ${step} sur ${total}`}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold text-ink">Étape {step} sur {total}</span>
        <span className="text-ink/40">{step === total ? "100%" : label}</span>
      </div>
      <div className="mt-2 flex gap-2">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < step ? "bg-ink" : "bg-ink/10",
            )}
          />
        ))}
      </div>
    </div>
  );
}