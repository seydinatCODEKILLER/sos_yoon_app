import { useId, useState } from "react";
import { motion } from "motion/react";
import { courbeLissee, libelleJour } from "../lib/formatDashboard";
import type { PointEvolution } from "../types/dashboard.types";

const W = 1000;
const H = 240;
const PAD = 24;

export function GraphiqueEvolution({ points }: { points: PointEvolution[] }) {
  const idDegrade = useId().replace(/:/g, "");
  const [survol, setSurvol] = useState<number | null>(null);
  const n = points.length;
  if (n === 0) return null;

  const actif = survol ?? n - 1;
  const max = Math.max(...points.map((p) => p.total), 1);

  const coords = points.map((p, i) => ({
    x: n === 1 ? W / 2 : PAD + (i / (n - 1)) * (W - 2 * PAD),
    y: H - (0.12 + 0.76 * (p.total / max)) * H,
  }));

  const ligne = courbeLissee(coords);
  const aire = `${ligne} L${coords[n - 1].x},${H} L${coords[0].x},${H} Z`;
  const pas = n > 1 ? ((W - 2 * PAD) / (n - 1) / W) * 100 : 100;
  const pasLibelle = n <= 8 ? 1 : 5;

  const pct = (c: { x: number; y: number }) => ({
    left: `${(c.x / W) * 100}%`,
    top: `${(c.y / H) * 100}%`,
  });

  return (
    <div
      role="img"
      aria-label="Évolution des demandes reçues sur la période"
      className="px-2"
    >
      <div className="relative h-56 w-full sm:h-60">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <defs>
            <linearGradient id={idDegrade} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1="0"
              x2={W}
              y1={H * g}
              y2={H * g}
              className="stroke-ink/10"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <motion.path
            d={aire}
            fill={`url(#${idDegrade})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.path
            d={ligne}
            fill="none"
            className="stroke-signal"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        {/* Points */}
        {coords.map((c, i) => (
          <span
            key={points[i].date}
            aria-hidden
            style={pct(c)}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal ${
              i === actif ? "size-3.5 border-[3px] border-white shadow" : "size-2"
            }`}
          />
        ))}

        {/* Info-bulle */}
        <div
          style={pct(coords[actif])}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg bg-navy px-2.5 py-1.5 text-center text-xs font-semibold whitespace-nowrap text-white shadow-lg"
        >
          {points[actif].total} demande{points[actif].total > 1 ? "s" : ""}
        </div>

        {/* Zones de survol / focus clavier */}
        {coords.map((c, i) => (
          <button
            key={points[i].date}
            type="button"
            aria-label={`${libelleJour(points[i].date)} : ${points[i].total} demandes`}
            onMouseEnter={() => setSurvol(i)}
            onMouseLeave={() => setSurvol(null)}
            onFocus={() => setSurvol(i)}
            onBlur={() => setSurvol(null)}
            style={{ left: `${(c.x / W) * 100 - pas / 2}%`, width: `${pas}%` }}
            className="absolute top-0 h-full cursor-pointer outline-none"
          />
        ))}
      </div>

      {/* Libellés de l'axe */}
      <div className="relative mt-2 h-5">
        {coords.map((c, i) => {
          const decalage = n - 1 - i;
          if (decalage % pasLibelle !== 0) return null;
          const dernier = i === n - 1;
          return (
            <span
              key={points[i].date}
              style={{ left: `${(c.x / W) * 100}%` }}
              className={`absolute -translate-x-1/2 text-[11px] whitespace-nowrap ${
                dernier ? "font-bold text-ink" : "text-ink/50"
              } ${n <= 8 && decalage % 2 === 1 ? "max-sm:hidden" : ""}`}
            >
              {dernier ? "Aujourd'hui" : libelleJour(points[i].date)}
            </span>
          );
        })}
      </div>
    </div>
  );
}