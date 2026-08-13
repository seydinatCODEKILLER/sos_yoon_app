import { useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const audiences = [
  {
    key: "public",
    eyebrow: "Vous avez besoin d'aide",
    title: "Particuliers, familles, entreprises",
    description:
      "Vous, votre famille ou votre entreprise faites face à une situation juridique urgente. Diaspora comprise, où que vous soyez.",
    meta: "Professionnels en ligne maintenant",
    cta: "Décrire mon urgence",
    icon: Users,
    accent: "signal" as const,
    direction: -40,
  },
  {
    key: "pro",
    eyebrow: "Vous exercez le droit",
    title: "Avocats, notaires, huissiers, juristes",
    description:
      "Digitalisez votre pratique, recevez des demandes ciblées selon votre spécialité et votre disponibilité réelle.",
    meta: "Réseau vérifié, inscription gratuite",
    cta: "Rejoindre en tant que professionnel",
    icon: Briefcase,
    accent: "brass" as const,
    direction: 40,
  },
];

function AudienceCard({ audience }: { audience: (typeof audiences)[number] }) {
  const isSignal = audience.accent === "signal";
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, x: audience.direction }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative flex flex-col justify-between overflow-hidden bg-paper p-10 md:p-14"
    >
      {/* spotlight qui suit la souris */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${spot.x}% ${spot.y}%, ${
            isSignal ? "var(--color-signal)" : "var(--color-brass)"
          }14, transparent 70%)`,
        }}
      />

      {/* texture de fond distinctive */}
      {isSignal ? (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
          aria-hidden
        >
          <pattern
            id="dots-signal"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.4" fill="var(--color-signal)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots-signal)" />
        </svg>
      ) : (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
          aria-hidden
        >
          <pattern
            id="lines-brass"
            width="100%"
            height="26"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="26"
              x2="100%"
              y2="26"
              stroke="var(--color-brass)"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#lines-brass)" />
        </svg>
      )}

      <div className="relative">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-105 ${
            isSignal
              ? "border-signal/25 bg-signal/10"
              : "border-brass/25 bg-brass/10"
          }`}
        >
          <audience.icon
            size={24}
            strokeWidth={1.5}
            className={isSignal ? "text-signal" : "text-brass"}
          />
        </div>

        <p
          className={`mb-3 mt-6 text-sm font-medium uppercase tracking-widest ${
            isSignal ? "text-signal" : "text-brass"
          }`}
        >
          {audience.eyebrow}
        </p>
        <h3 className="font-display text-2xl leading-tight text-ink md:text-3xl">
          {audience.title}
        </h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
          {audience.description}
        </p>

        <div className="mt-5 flex items-center gap-1.5 text-xs text-ink/45">
          <span
            className={`h-1.5 w-1.5 rounded-full ${isSignal ? "bg-signal" : "bg-brass"}`}
          />
          {audience.meta}
        </div>
      </div>

      <Button
        className={`group/btn relative mt-10 h-auto w-fit gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:gap-3 ${
          isSignal
            ? "bg-signal text-ink hover:bg-signal/90 hover:shadow-[0_16px_32px_-16px_var(--color-signal)]"
            : "bg-ink text-paper hover:bg-ink/90 hover:shadow-[0_16px_32px_-16px_rgba(11,18,32,0.5)]"
        }`}
      >
        {audience.cta}
        <ArrowRight
          size={16}
          className="transition-transform group-hover/btn:translate-x-1"
        />
      </Button>
    </motion.div>
  );
}

export function AudienceSection() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-ink/10 md:grid-cols-2">
          {audiences.map((audience) => (
            <AudienceCard key={audience.key} audience={audience} />
          ))}

          {/* pivot central "OU" */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper text-xs font-medium uppercase tracking-widest text-ink/50 shadow-lg md:flex"
          >
            Ou
          </motion.div>
        </div>
      </div>
    </section>
  );
}
