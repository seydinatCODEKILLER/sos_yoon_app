import { motion } from "motion/react";
import { ShieldCheck, Lock, BadgeCheck } from "lucide-react";
import { AnimatedSection } from "@/shared/components/AnimatedSection";
import { StaggerGroup, StaggerItem } from "@/shared/components/StaggerGroup";

const points = [
  {
    icon: Lock,
    title: "Données chiffrées",
    description:
      "Vos échanges et informations personnelles sont protégés de bout en bout.",
  },
  {
    icon: BadgeCheck,
    title: "Professionnels vérifiés",
    description:
      "Chaque avocat, notaire, huissier et juriste est validé avant de rejoindre la plateforme.",
  },
  {
    icon: ShieldCheck,
    title: "Confidentialité garantie",
    description:
      "Votre situation reste strictement entre vous et le professionnel mis en relation.",
  },
];

export function TrustSecurity() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      {/* filigrane façon papier sécurisé */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
      >
        <defs>
          <pattern
            id="guilloche"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,36 Q18,8 36,36 T72,36"
              fill="none"
              stroke="var(--color-brass)"
              strokeWidth="1"
            />
            <path
              d="M0,54 Q18,26 36,54 T72,54"
              fill="none"
              stroke="var(--color-brass)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#guilloche)" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-6">
        <AnimatedSection className="max-w-xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brass">
            Confiance
          </p>
          <h2 className="font-display text-3xl leading-tight text-ink md:text-5xl">
            Une urgence juridique reste une affaire privée.
          </h2>
        </AnimatedSection>

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {points.map((point, i) => (
            <StaggerItem key={point.title}>
              <div className="relative rounded-3xl border border-ink/10 bg-paper/60 p-8 backdrop-blur-sm">
                {/* cachet de cire */}
                <motion.div
                  className="relative inline-flex"
                  initial={{ scale: 1.6, rotate: -14, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: -6, opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 + i * 0.1,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass/70 bg-brass/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-brass/50">
                      <point.icon
                        size={20}
                        strokeWidth={1.75}
                        className="text-brass"
                      />
                    </div>
                  </div>
                </motion.div>

                <h3 className="mt-6 font-display text-lg text-ink">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {point.description}
                </p>

                {/* coin plié, façon document authentifié */}
                <div
                  aria-hidden
                  className="absolute right-0 top-0 h-6 w-6 rounded-tr-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 50%, var(--color-brass) 50%)",
                    opacity: 0.15,
                  }}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
