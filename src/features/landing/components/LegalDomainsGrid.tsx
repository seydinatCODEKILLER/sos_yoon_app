import {
  Scale,
  Gavel,
  FileSignature,
  BookUser,
  ArrowUpRight,
} from "lucide-react";
import { AnimatedSection } from "@/shared/components/AnimatedSection";
import { StaggerGroup, StaggerItem } from "@/shared/components/StaggerGroup";

const domains = [
  {
    icon: Scale,
    title: "Avocat",
    description: "Conseil, défense et représentation devant les juridictions.",
    tag: "Réponse en minutes",
  },
  {
    icon: Gavel,
    title: "Huissier",
    description:
      "Constats, significations et exécution des décisions de justice.",
    tag: "Intervention rapide",
  },
  {
    icon: FileSignature,
    title: "Notaire",
    description: "Actes authentiques, successions, transactions immobilières.",
    tag: "Sur rendez-vous",
  },
  {
    icon: BookUser,
    title: "Juriste-conseil",
    description: "Accompagnement juridique pour particuliers et entreprises.",
    tag: "Conseil à distance",
  },
];

export function LegalDomainsGrid() {
  return (
    <section className="bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-signal">
            Un métier pour chaque situation
          </p>
          <h2 className="max-w-xl font-display text-3xl leading-tight md:text-5xl">
            Quatre professions du droit, une seule porte d'entrée.
          </h2>
        </AnimatedSection>

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain) => (
            <StaggerItem
              key={domain.title}
              className="group relative overflow-hidden bg-ink p-8 transition-colors duration-300 hover:bg-paper/4 md:p-10"
            >
              {/* icône en filigrane */}
              <domain.icon
                size={128}
                strokeWidth={1}
                className="pointer-events-none absolute -bottom-8 -right-8 text-paper/4 transition-all duration-500 group-hover:scale-110 group-hover:text-signal/8"
              />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-signal/20 bg-signal/10 transition-colors duration-300 group-hover:border-signal/40 group-hover:bg-signal/15">
                  <domain.icon
                    size={24}
                    strokeWidth={1.5}
                    className="text-signal"
                  />
                </div>

                <h3 className="mt-6 font-display text-2xl">{domain.title}</h3>
                <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-paper/60">
                  {domain.description}
                </p>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-brass">
                  <span className="h-1 w-1 rounded-full bg-brass" />
                  {domain.tag}
                </div>

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.75}
                  className="absolute right-0 top-0 -translate-y-1 text-paper/0 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-signal group-hover:opacity-100"
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
