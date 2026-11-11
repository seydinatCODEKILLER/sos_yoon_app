import { useId, useMemo, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { formaterNombre } from "../lib/formatAdmin";
import type { EvolutionDemandes, VueEvolution } from "../types/dashboard.types";

const VUES: { valeur: VueEvolution; libelle: string }[] = [
  { valeur: "JOUR", libelle: "Par jour" },
  { valeur: "SEMAINE", libelle: "Par semaine" },
  { valeur: "MOIS", libelle: "Par mois" },
  { valeur: "METIER", libelle: "Par métier" },
];

const COURBE_ANNEE = "#f9610d";
const COURBE_PASSEE = "#7dd3fc";

const W = 1000;
const H = 240;
const MARGE_HAUT = 14;
const EASE = [0.21, 0.47, 0.32, 0.98] as const;

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

const somme = (v: number[]) => v.reduce((s, n) => s + n, 0);

interface GraphiqueEvolutionAdminProps {
  evolution: EvolutionDemandes | undefined;
  vue: VueEvolution;
  onChangerVue: (v: VueEvolution) => void;
  erreur?: boolean;
  onReessayer?: () => void;
}

export function GraphiqueEvolutionAdmin({
  evolution,
  vue,
  onChangerVue,
  erreur,
  onReessayer,
}: GraphiqueEvolutionAdminProps) {
  const libelleVue = VUES.find((v) => v.valeur === vue)?.libelle ?? "";
  const totalAnnee = evolution ? somme(evolution.cetteAnnee) : 0;
  const totalPassee = evolution ? somme(evolution.anneePassee) : 0;

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
                className={`relative shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  actif ? "text-white" : "text-ink/45 hover:text-ink"
                }`}
              >
                {actif && (
                  <motion.span
                    layoutId="vue-evolution-active"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-lg bg-ink"
                  />
                )}
                <span className="relative">{v.libelle}</span>
              </button>
            );
          })}
        </div>

        <ul className="flex gap-4 text-[11px] text-ink/60">
          <li className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-signal" aria-hidden />
            Cette année{evolution && <b className="text-ink tabular-nums"> · {formaterNombre(totalAnnee)}</b>}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-300" aria-hidden />
            L'année passée{evolution && <b className="text-ink tabular-nums"> · {formaterNombre(totalPassee)}</b>}
          </li>
        </ul>
      </header>

      {erreur && !evolution ? (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Impossible de charger l'évolution.{" "}
          {onReessayer && (
            <button onClick={onReessayer} className="font-semibold underline">
              Réessayer
            </button>
          )}
        </p>
      ) : !evolution ? (
        <div className="mt-4 h-64 animate-pulse rounded-lg bg-ink/5" />
      ) : evolution.libelles.length === 0 ? (
        <p className="mt-4 rounded-lg bg-ink/3 px-4 py-16 text-center text-sm text-ink/55">
          Pas encore de données pour cette vue.
        </p>
      ) : evolution.vue === "METIER" ? (
        <BarresParMetier evolution={evolution} />
      ) : (
        <Courbes evolution={evolution} libelleVue={libelleVue} />
      )}

      {evolution && totalAnnee + totalPassee === 0 && evolution.libelles.length > 0 && (
        <p className="mt-2 text-center text-xs text-ink/50">Aucune demande sur cette période.</p>
      )}
    </section>
  );
}

function TableauAccessible({ evolution, libelleVue }: { evolution: EvolutionDemandes; libelleVue: string }) {
  return (
    // Un <table> ignore overflow:hidden : on le range dans un conteneur masqué visuellement
    <div className="sr-only">
    <table>
      <caption>Demandes {libelleVue.toLowerCase()}, cette année et l'année passée</caption>
      <thead>
        <tr>
          <th scope="col">Période</th>
          <th scope="col">Cette année</th>
          <th scope="col">L'année passée</th>
        </tr>
      </thead>
      <tbody>
        {evolution.libelles.map((l, i) => (
          <tr key={`${l}-${i}`}>
            <th scope="row">{l}</th>
            <td>{evolution.cetteAnnee[i] ?? 0}</td>
            <td>{evolution.anneePassee[i] ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

/** Jour, semaine, mois : deux courbes, avec une info-bulle qui suit le pointeur. */
function Courbes({ evolution, libelleVue }: { evolution: EvolutionDemandes; libelleVue: string }) {
  const idDegrade = useId();
  const idRevelation = useId();
  const reduit = useReducedMotion();
  const [survol, setSurvol] = useState<number | null>(null);

  const calcul = useMemo(() => {
    const max = Math.max(1, ...evolution.cetteAnnee, ...evolution.anneePassee) * 1.1;
    const ptsAnnee = pointsDe(evolution.cetteAnnee, max);
    const ptsPassee = pointsDe(evolution.anneePassee, max);
    const sommet = ptsAnnee.reduce((m, p, i) => (p[1] < ptsAnnee[m][1] ? i : m), 0);
    const trace = courbe(ptsAnnee);
    return {
      ptsAnnee,
      ptsPassee,
      trace,
      aire: `${trace} L${W},${H} L0,${H} Z`,
      tracePassee: courbe(ptsPassee),
      sommet: ptsAnnee[sommet],
      assez: ptsAnnee.length > 1,
    };
  }, [evolution]);

  const n = evolution.libelles.length;

  function suivre(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width === 0 || n === 0) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setSurvol(n === 1 ? 0 : Math.round(ratio * (n - 1)));
  }

  const actif = survol !== null && survol < n ? survol : null;
  const gauche = actif === null ? 0 : (calcul.ptsAnnee[actif][0] / W) * 100;

  return (
    <div className="mt-4">
      <TableauAccessible evolution={evolution} libelleVue={libelleVue} />
      <div className="relative h-56 sm:h-64" aria-hidden>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="size-full overflow-visible">
          <defs>
            <linearGradient id={idDegrade} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COURBE_ANNEE} stopOpacity="0.28" />
              <stop offset="100%" stopColor={COURBE_ANNEE} stopOpacity="0" />
            </linearGradient>
            <clipPath id={idRevelation}>
              {/* La courbe se dessine de gauche à droite à chaque changement de vue */}
              <motion.rect
                key={evolution.vue}
                x="-20"
                y="-20"
                height={H + 40}
                initial={reduit ? false : { width: 0 }}
                animate={{ width: W + 40 }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </clipPath>
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

          <motion.path
            key={`passee-${evolution.vue}`}
            d={calcul.tracePassee}
            fill="none"
            stroke={COURBE_PASSEE}
            strokeWidth="2"
            strokeDasharray="5 5"
            vectorEffect="non-scaling-stroke"
            initial={reduit ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <g clipPath={`url(#${idRevelation})`}>
            <path d={calcul.aire} fill={`url(#${idDegrade})`} />
            <path
              d={calcul.trace}
              fill="none"
              stroke={COURBE_ANNEE}
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {actif !== null && (
            <line
              x1={calcul.ptsAnnee[actif][0]}
              x2={calcul.ptsAnnee[actif][0]}
              y1="0"
              y2={H}
              stroke="currentColor"
              className="text-ink/20"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {calcul.assez && actif === null && (
          <motion.span
            initial={reduit ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 400, damping: 18 }}
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-signal bg-white"
            style={{
              left: `${(calcul.sommet[0] / W) * 100}%`,
              top: `${(calcul.sommet[1] / H) * 100}%`,
            }}
          />
        )}

        {actif !== null && (
          <>
            <span
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
              style={{ left: `${gauche}%`, top: `${(calcul.ptsPassee[actif][1] / H) * 100}%`, background: COURBE_PASSEE }}
            />
            <span
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
              style={{ left: `${gauche}%`, top: `${(calcul.ptsAnnee[actif][1] / H) * 100}%`, background: COURBE_ANNEE }}
            />
            <div
              className="pointer-events-none absolute top-0 z-10 w-36 rounded-lg border border-ink/10 bg-white px-3 py-2 text-[11px] shadow-lg"
              style={{
                left: `${gauche}%`,
                transform: `translateX(${gauche > 70 ? "calc(-100% - 12px)" : "12px"})`,
              }}
            >
              <p className="font-bold text-ink">{evolution.libelles[actif]}</p>
              <p className="mt-1 flex items-center justify-between gap-2 text-ink/70">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-signal" /> Cette année
                </span>
                <b className="text-ink tabular-nums">{evolution.cetteAnnee[actif] ?? 0}</b>
              </p>
              <p className="flex items-center justify-between gap-2 text-ink/70">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-sky-300" /> Année passée
                </span>
                <b className="text-ink tabular-nums">{evolution.anneePassee[actif] ?? 0}</b>
              </p>
            </div>
          </>
        )}

        {/* Zone de survol : souris et toucher */}
        <div
          className="absolute inset-0 cursor-crosshair touch-pan-y"
          onPointerMove={suivre}
          onPointerDown={suivre}
          onPointerLeave={() => setSurvol(null)}
        />
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-ink/45" aria-hidden>
        {evolution.libelles.map((l, i) => (
          <span key={`${l}-${i}`} className={`max-sm:even:invisible ${i === actif ? "font-bold text-ink" : ""}`}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Par métier : des catégories, pas une série dans le temps, donc des barres plutôt qu'une courbe. */
function BarresParMetier({ evolution }: { evolution: EvolutionDemandes }) {
  const reduit = useReducedMotion();
  const max = Math.max(1, ...evolution.cetteAnnee, ...evolution.anneePassee);

  return (
    <div className="mt-4">
      <TableauAccessible evolution={evolution} libelleVue="par métier" />
      <ul className="grid h-56 grid-flow-col auto-cols-fr items-end gap-4 sm:h-64 sm:gap-8" aria-hidden>
        {evolution.libelles.map((l, i) => (
          <li key={`${l}-${i}`} className="flex h-full min-w-0 flex-col justify-end gap-2">
            <div className="flex flex-1 items-end justify-center gap-1.5 sm:gap-2">
              {[
                { valeur: evolution.cetteAnnee[i] ?? 0, couleur: COURBE_ANNEE, delai: 0 },
                { valeur: evolution.anneePassee[i] ?? 0, couleur: COURBE_PASSEE, delai: 0.08 },
              ].map((b, k) => (
                <div key={k} className="flex h-full w-full max-w-10 flex-col items-center justify-end gap-1">
                  <span className="text-[11px] font-bold text-ink tabular-nums">{b.valeur}</span>
                  <motion.div
                    key={`${evolution.vue}-${k}`}
                    initial={reduit ? false : { height: 0 }}
                    animate={{ height: `${Math.max((b.valeur / max) * 82, b.valeur > 0 ? 3 : 0)}%` }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.08 + b.delai, ease: EASE }}
                    className="w-full rounded-t-lg"
                    style={{ background: b.couleur }}
                  />
                </div>
              ))}
            </div>
            <span className="truncate text-center text-xs font-semibold text-ink">{l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}