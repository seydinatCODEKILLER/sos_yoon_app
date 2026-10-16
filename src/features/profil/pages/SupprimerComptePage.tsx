import { ProfilSousPage } from "../components/ProfilSousPage";
import { SupprimerCompteForm } from "../components/SupprimerCompteForm";

export function SupprimerComptePage() {
  return (
    <ProfilSousPage titre="Supprimer mon compte">
      <h2 className="text-[22px] font-bold text-red-700">
        Suppression définitive du compte
      </h2>
      <p className="mt-2 mb-5 text-[15px] leading-snug text-ink/60">
        Cette action est irréversible. Toutes vos informations seront effacées.
      </p>
      <SupprimerCompteForm />
    </ProfilSousPage>
  );
}