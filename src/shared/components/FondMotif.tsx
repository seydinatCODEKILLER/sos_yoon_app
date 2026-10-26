import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

type Teinte = "signal" | "succes" | "alerte";

const HALO: Record<Teinte, string> = {
  signal: "bg-signal/20",
  succes: "bg-emerald-400/25",
  alerte: "bg-red-400/20",
};

type Props = {
  children: ReactNode;
  teinte?: Teinte;
};

export function FondMotif({ children, teinte = "signal" }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh overflow-hidden bg-linear-to-b from-navy/6 via-paper to-signal/8">
        {/* Motif de points, estompé vers les bords */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(23_22_48/0.14)_1.2px,transparent_0)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_at_center,black_25%,transparent_78%)]"
        />
        {/* Halo coloré en haut */}
        <div
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-0 size-130 -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl ${HALO[teinte]}`}
        />
        <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-10">
          {children}
        </div>
      </div>
    </MotionConfig>
  );
}