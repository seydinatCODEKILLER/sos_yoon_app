import { Loader2 } from "lucide-react";
import { ProfilSousPage } from "../components/ProfilSousPage";
import { ChangerCodeSecretForm } from "../components/ChangerCodeSecretForm";
import { useProfil } from "../hooks/useProfil";

export function CodeSecretPage() {
  const { data: profil, isPending, error } = useProfil();

  return (
    <ProfilSousPage titre="Code secret">
      {isPending ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-ink/40" aria-label="Chargement" />
        </div>
      ) : error || !profil ? (
        <p role="alert" className="py-24 text-center text-sm text-red-600">
          Impossible de charger votre profil.
        </p>
      ) : (
        <>
          <h2 className="text-[22px] leading-tight font-bold text-navy">
            {profil.codeSecretDefini
              ? "Modifier votre code secret"
              : "Définir votre code secret"}
          </h2>
          <p className="mt-2 text-[14px] leading-snug text-ink/60">
            {profil.codeSecretDefini
              ? "Ce code à 4 chiffres sécurise l'accès à vos dossiers et à vos demandes."
              : "Vous n'avez pas encore de code secret. Choisissez-en un pour vous reconnecter sans SMS."}
          </p>

          <div className="mt-6 flex flex-1 flex-col">
            <ChangerCodeSecretForm codeSecretDefini={profil.codeSecretDefini} />
          </div>
        </>
      )}
    </ProfilSousPage>
  );
}