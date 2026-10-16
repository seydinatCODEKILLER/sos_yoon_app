import { ProfilSousPage } from "../components/ProfilSousPage";
import { ChangerCodeSecretForm } from "../components/ChangerCodeSecretForm";

export function CodeSecretPage() {
  return (
    <ProfilSousPage titre="Code secret">
      <h2 className="text-[22px] leading-tight font-bold text-navy">
        Modifier votre code secret
      </h2>
      <p className="mt-2 text-[14px] leading-snug text-ink/60">
        Ce code à 4 chiffres sécurise l'accès à vos dossiers et à vos demandes.
      </p>

      <div className="mt-6 flex flex-1 flex-col">
        <ChangerCodeSecretForm />
      </div>
    </ProfilSousPage>
  );
}