import { PageJuridique } from "../components/PageJuridique";
import { CGU } from "../lib/contenueCgu";

export function CguPage() {
  return <PageJuridique document={CGU} autre={{ libelle: "Politique de confidentialité", vers: "/confidentialite" }} />;
}