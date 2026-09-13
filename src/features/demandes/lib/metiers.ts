import { Scale, Gavel, Stamp, BookOpen, type LucideIcon } from "lucide-react";
import type { Metier } from "@/types/user.types";

export const METIERS: {
  value: Metier;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: "signal" | "brass" | "ink";
}[] = [
  {
    value: "AVOCAT",
    label: "Avocat",
    description: "Conseil, défense et représentation devant les tribunaux.",
    icon: Scale,
    accent: "signal",
  },
  {
    value: "HUISSIER",
    label: "Huissier",
    description: "Constats, significations et exécution des décisions de justice.",
    icon: Gavel,
    accent: "brass",
  },
  {
    value: "NOTAIRE",
    label: "Notaire",
    description: "Actes authentiques : immobilier, succession, contrats.",
    icon: Stamp,
    accent: "ink",
  },
  {
    value: "JURISTE_CONSEIL",
    label: "Juriste-conseil",
    description: "Conseil juridique sans représentation devant les tribunaux.",
    icon: BookOpen,
    accent: "signal",
  },
];