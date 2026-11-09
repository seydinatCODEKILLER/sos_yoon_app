import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProfilSousPage } from "../components/ProfilSousPage";
import { NouveauNumeroForm } from "../components/NouveauNumeroForm";
import { ConfirmerNumeroForm } from "../components/ConfirmerNumeroForm";
import { useProfil } from "../hooks/useProfil";
import { profilRoutes } from "../lib/profilRoutes";

type Etape =
  | { nom: "saisie" }
  | { nom: "code"; nouveauTelephone: string; delaiInitial: number };

export function ChangerTelephonePage() {
  const navigate = useNavigate();
  const { data: profil, isPending, error } = useProfil();
  const [etape, setEtape] = useState<Etape>({ nom: "saisie" });

  return (
    <ProfilSousPage titre="Numéro de téléphone">
      {isPending ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-ink/40" aria-label="Chargement" />
        </div>
      ) : error || !profil ? (
        <p role="alert" className="py-24 text-center text-sm text-red-600">
          Impossible de charger votre profil.
        </p>
      ) : etape.nom === "saisie" ? (
        <>
          <h2 className="text-[22px] leading-tight font-bold text-navy">
            Modifier votre numéro
          </h2>
          <p className="mt-2 mb-6 text-[15px] leading-snug text-ink/60">
            Nous enverrons un code de vérification au nouveau numéro.
          </p>
          <NouveauNumeroForm
            telephoneActuel={profil.telephone}
            onCodeEnvoye={(nouveauTelephone, delaiInitial) =>
              setEtape({ nom: "code", nouveauTelephone, delaiInitial })
            }
          />
        </>
      ) : (
        <ConfirmerNumeroForm
          nouveauTelephone={etape.nouveauTelephone}
          delaiInitial={etape.delaiInitial}
          onModifierNumero={() => setEtape({ nom: "saisie" })}
          onConfirme={() => navigate(profilRoutes.accueil, { replace: true })}
        />
      )}
    </ProfilSousPage>
  );
}