import { Loader2 } from "lucide-react";
import { useProfil } from "../hooks/useProfil";
import { ProfilSousPage } from "../components/ProfilSousPage";
import { MesInformationsForm } from "../components/MesInformationsForm";

export function MesInformationsPage() {
  const { data: profil, isPending, error } = useProfil();

  return (
    <ProfilSousPage titre="Mes informations">
      {isPending ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-ink/40" aria-label="Chargement" />
        </div>
      ) : error || !profil ? (
        <p role="alert" className="py-24 text-center text-sm text-red-600">
          Impossible de charger votre profil.
        </p>
      ) : (
        <MesInformationsForm profil={profil} />
      )}
    </ProfilSousPage>
  );
}