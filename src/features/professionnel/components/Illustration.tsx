import { motion, useReducedMotion } from "motion/react";

export type Scene =
  | "examen"
  | "approuve"
  | "refus"
  | "valide"
  | "mail-cours"
  | "mail-ok"
  | "mail-erreur";

/** Palette des illustrations : posées sur le panneau bleu nuit */
const PAPIER = "#faf8f4";
const PAPIER_OMBRE = "#e4e0d6";
const ENCRE = "#171630";
const SIGNAL = "#f9610d";
const VALIDE = "#34d399";

/** Étoile à pointes droites : forme du sceau */
function etoile(cx: number, cy: number, pointes: number, rExt: number, rInt: number) {
  const pts: string[] = [];
  for (let i = 0; i < pointes * 2; i++) {
    const r = i % 2 ? rInt : rExt;
    const a = (Math.PI * i) / pointes - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/** Lignes de texte d'une feuille */
function Lignes({
  x,
  y,
  largeurs,
  pas = 22,
  opacite = 0.2,
}: {
  x: number;
  y: number;
  largeurs: number[];
  pas?: number;
  opacite?: number;
}) {
  return (
    <>
      {largeurs.map((l, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * pas}
          width={l}
          height="7"
          fill={ENCRE}
          fillOpacity={opacite}
        />
      ))}
    </>
  );
}

/** Une feuille, avec ses deux feuilles en retrait */
function Feuille({ pile = true }: { pile?: boolean }) {
  return (
    <>
      {pile && (
        <>
          <rect
            x="108"
            y="64"
            width="190"
            height="260"
            fill="white"
            fillOpacity="0.1"
            transform="rotate(-7 203 194)"
          />
          <rect
            x="108"
            y="64"
            width="190"
            height="260"
            fill="white"
            fillOpacity="0.2"
            transform="rotate(5 203 194)"
          />
        </>
      )}
      <rect x="104" y="60" width="190" height="260" fill={PAPIER} />
      <rect x="130" y="88" width="76" height="12" fill={ENCRE} />
      <Lignes x={130} y={124} largeurs={[138, 120, 138, 96, 130]} />
    </>
  );
}

function Examen({ reduire }: { reduire: boolean | null }) {
  return (
    <>
      <Feuille />
      <rect x="130" y="276" width="62" height="8" fill={SIGNAL} />
      {/* La loupe se pose sur le dossier */}
      <motion.g
        initial={reduire ? false : { x: 70, y: 46, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <line x1="318" y1="278" x2="368" y2="328" stroke={SIGNAL} strokeWidth="20" />
        <circle
          cx="270"
          cy="232"
          r="64"
          fill={PAPIER}
          fillOpacity="0.1"
          stroke={PAPIER}
          strokeWidth="12"
        />
      </motion.g>
    </>
  );
}

function Approuve({ reduire }: { reduire: boolean | null }) {
  return (
    <>
      <Feuille />
      <motion.g
        style={{ transformOrigin: "266px 244px" }}
        initial={reduire ? false : { scale: 1.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.25, ease: "easeIn" }}
      >
        <polygon points={etoile(266, 244, 14, 78, 66)} fill={VALIDE} />
        <circle cx="266" cy="244" r="48" fill="none" stroke={ENCRE} strokeWidth="4" />
        <path d="M242 246 L260 264 L294 224" fill="none" stroke={ENCRE} strokeWidth="10" />
      </motion.g>
    </>
  );
}

function Refus() {
  return (
    <>
      <Feuille />
      {/* La ligne en cause est cernée */}
      <rect
        x="120"
        y="164"
        width="158"
        height="26"
        fill="none"
        stroke={SIGNAL}
        strokeWidth="5"
      />
      {/* Crayon */}
      <g transform="translate(236 292) rotate(-38)">
        <rect x="0" y="-10" width="118" height="20" fill={SIGNAL} />
        <polygon points="0,-10 -36,0 0,10" fill={PAPIER} />
        <polygon points="-36,0 -23,-4.5 -23,4.5" fill={ENCRE} />
        <rect x="118" y="-10" width="18" height="20" fill={PAPIER} fillOpacity="0.85" />
      </g>
      {/* Pastille d'alerte sur le coin de la feuille */}
      <rect x="268" y="38" width="52" height="52" fill={SIGNAL} />
      <rect x="291" y="49" width="6" height="22" fill={ENCRE} />
      <rect x="291" y="77" width="6" height="6" fill={ENCRE} />
    </>
  );
}

function Balance() {
  return (
    <>
      <rect x="194" y="96" width="12" height="226" fill={PAPIER} />
      <rect x="136" y="322" width="128" height="14" fill={PAPIER} />
      <rect x="64" y="98" width="272" height="10" fill={PAPIER} />
      <rect x="184" y="84" width="32" height="32" fill={SIGNAL} />
      {/* plateau gauche */}
      <path d="M80 108 L38 222 M80 108 L122 222" stroke={PAPIER} strokeWidth="3" fill="none" />
      <rect x="28" y="222" width="104" height="10" fill={PAPIER} />
      {/* plateau droit : le dossier */}
      <path d="M320 108 L278 222 M320 108 L362 222" stroke={PAPIER} strokeWidth="3" fill="none" />
      <rect x="268" y="222" width="104" height="10" fill={PAPIER} />
      <rect x="296" y="178" width="48" height="44" fill={VALIDE} />
      <path d="M306 202 L318 214 L336 192" stroke={ENCRE} strokeWidth="6" fill="none" />
    </>
  );
}

/** Enveloppe fermée : corps, rabat, plis du bas */
function EnveloppeFermee() {
  return (
    <>
      <rect x="70" y="140" width="260" height="180" fill={PAPIER} />
      <path d="M70 320 L170 232 M330 320 L230 232" stroke={ENCRE} strokeOpacity="0.16" strokeWidth="3" fill="none" />
      <polygon points="70,140 330,140 200,252" fill={PAPIER_OMBRE} />
    </>
  );
}

function MailCours() {
  return (
    <>
      <EnveloppeFermee />
      <circle cx="318" cy="118" r="36" fill={ENCRE} stroke="white" strokeOpacity="0.2" strokeWidth="8" />
      <circle
        cx="318"
        cy="118"
        r="36"
        fill="none"
        stroke="white"
        strokeWidth="8"
        strokeDasharray="56 170"
        className="animate-spin motion-reduce:animate-none"
        style={{ transformOrigin: "318px 118px" }}
      />
    </>
  );
}

function MailOk({ reduire }: { reduire: boolean | null }) {
  return (
    <>
      {/* rabat ouvert, derrière */}
      <polygon points="70,320 70,150 200,52 330,150 330,320" fill={PAPIER_OMBRE} />
      {/* la lettre sort de l'enveloppe */}
      <motion.g
        initial={reduire ? false : { y: 56 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <rect x="102" y="82" width="196" height="190" fill={PAPIER} />
        <path d="M148 140 L180 172 L252 100" stroke={VALIDE} strokeWidth="12" fill="none" />
        <Lignes x={132} y={204} largeurs={[136, 104]} />
      </motion.g>
      {/* poche avant */}
      <polygon points="70,320 70,176 200,262 330,176 330,320" fill={PAPIER} />
      <path d="M70 176 L200 262 L330 176" stroke={ENCRE} strokeOpacity="0.14" strokeWidth="3" fill="none" />
    </>
  );
}

function MailErreur() {
  return (
    <>
      <EnveloppeFermee />
      <rect x="282" y="86" width="76" height="76" fill={SIGNAL} />
      <rect x="316" y="102" width="8" height="30" fill={ENCRE} />
      <rect x="316" y="142" width="8" height="8" fill={ENCRE} />
    </>
  );
}

/**
 * Illustration à plat, angles droits, pour le panneau bleu nuit.
 * Décorative : cachée aux lecteurs d'écran (le texte à côté dit l'essentiel).
 */
export function Illustration({
  scene,
  className,
}: {
  scene: Scene;
  className?: string;
}) {
  const reduire = useReducedMotion();

  return (
    <svg aria-hidden viewBox="0 0 400 360" fill="none" className={className}>
      {/* sol */}
      <rect x="20" y="344" width="360" height="3" fill="white" fillOpacity="0.14" />
      {scene === "examen" && <Examen reduire={reduire} />}
      {scene === "approuve" && <Approuve reduire={reduire} />}
      {scene === "refus" && <Refus />}
      {scene === "valide" && <Balance />}
      {scene === "mail-cours" && <MailCours />}
      {scene === "mail-ok" && <MailOk reduire={reduire} />}
      {scene === "mail-erreur" && <MailErreur />}
    </svg>
  );
}