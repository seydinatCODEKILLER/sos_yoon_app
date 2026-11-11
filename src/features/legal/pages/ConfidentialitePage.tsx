import { PageJuridique } from "../components/PageJuridique";
import { CONFIDENTIALITE } from "../lib/contenueConfidentialite";

export function ConfidentialitePage() {
  return <PageJuridique document={CONFIDENTIALITE} autre={{ libelle: "Conditions générales d'utilisation", vers: "/cgu" }} />;
}