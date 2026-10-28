import { useId, useMemo } from "react";
import type { EvolutionDemandes, VueEvolution } from "../types/dashboard.types";

const VUES: { valeur: VueEvolution; libelle: string }[] = [
  { valeur: "JOUR", libelle: "Par jour" },
  { valeur: "SEMAINE", libelle: "Par semaine" },
  { valeur: "MOIS", libelle: "Par mois" },
  { valeur: "METIER", libelle: "Par métier" },
];

const W = 1000;
const H = 240;
const MARGE_HAUT = 14;

type Point = [number, number];

function pointsDe(valeurs: number[], max: number): Point[] {
  const n = valeurs.length;
  return valeurs.map((v, i) => [n === 1 ? W / 2 : (i / (n - 1)) * W, H - (v / max) * (H - MARGE_HAUT)]);
}

const borne = (y: number) => Math.min(H, Math.max(0, y));

/** Courbe lissée (Catmull-Rom convertie en Bézier) */
function courbe(pts: Point[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, borne(p1[1] + (p2[1] - p0[1]) / 6)];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, borne(p2[1] - (p3[1] - p1[1]) / 6)];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

interface GraphiqueEvolutionAdminProps {
  evolution: EvolutionDemandes | undefined;
  vue: VueEvolution;
  onChangerVue: (v: VueEvolution) => void;
}

export function GraphiqueEvolutionAdmin({ evolution, vue, onChangerVue }: GraphiqueEvolutionAdminProps) {
  const idDegrade = useId();

  const calcul = useMemo(() => {
    if (!evolution || evolution.libelles.length === 0) return null;
    const max = Math.max(1, ...evolution.cetteAnnee, ...evolution.anneePassee) * 1.1;
    const ptsAnnee = pointsDe(evolution.cetteAnnee, max);
    const ptsPassee = pointsDe(evolution.anneePassee, max);
    const sommet = ptsAnnee.reduce((m, p, i) => (p[1] < ptsAnnee[m][1] ? i : m), 0);
    const trace = courbe(ptsAnnee);
    return {
      trace,
      aire: `${trace} L${W},${H} L0,${H} Z`,
      tracePassee: courbe(ptsPassee),
      sommet: ptsAnnee[sommet],
      assez: ptsAnnee.length > 1,
    };
  }, [evolution]);

  return (
    <section className="rounded-xl border border-ink/10 bg-white p-4 sm:p-5">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-sm font-bold text-ink">Évolution des demandes</h3>

        <div className="flex max-w-full gap-1 overflow-x-auto" role="group" aria-label="Choisir la vue">
          {VUES.map((v) => {
            const actif = v.valeur === vue;
            return (
              <button
                key={v.valeur}
                type="button"
                aria-pressed={actif}
                onClick={() => onChangerVue(v.valeur)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  actif ? "bg-ink text-white" : "text-ink/45 hover:text-ink"
                }`}
              >
                {v.libelle}
              </button>
            );
          })}
        </div>

        <ul className="flex gap-4 text-[11px] text-ink/60">
          <li className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-signal" aria-hidden />
            Cette année
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-300" aria-hidden />
            L'année passée
          </li>
        </ul>
      </header>

      {!calcul || !evolution ? (
        <div className="mt-4 h-64 animate-pulse rounded-lg bg-ink/5" />
      ) : (
        <div className="mt-4">
          <div className="relative h-56 sm:h-64">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={`Évolution des demandes, cette année comparée à l'année passée (${VUES.find((v) => v.valeur === vue)?.libelle.toLowerCase()})`}
              className="size-full overflow-visible"
            >
              <defs>
                <linearGradient id={idDegrade} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f9610d" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#f9610d" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="0"
                  x2={W}
                  y1={(H / 4) * i + 1}
                  y2={(H / 4) * i + 1}
                  stroke="currentColor"
                  className="text-ink/8"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              <path
                d={calcul.tracePassee}
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2"
                strokeDasharray="5 5"
                vectorEffect="non-scaling-stroke"
              />
              <path d={calcul.aire} fill={`url(#${idDegrade})`} />
              <path
                d={calcul.trace}
                fill="none"
                stroke="#f9610d"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {calcul.assez && (
              <span
                aria-hidden
                className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-signal bg-white"
                style={{
                  left: `${(calcul.sommet[0] / W) * 100}%`,
                  top: `${(calcul.sommet[1] / H) * 100}%`,
                }}
              />
            )}
          </div>

          <div className="mt-2 flex justify-between text-[11px] text-ink/45">
            {evolution.libelles.map((l, i) => (
              <span key={`${l}-${i}`} className="max-sm:even:invisible">
                {l}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}