import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import { useAuthStore } from "../store/auth.store";
import { authApi } from "../api/authApi";
import type { TypeDocumentPro } from "../types/types";
import {
  erreurInscriptionPro,
  type ErreurInscriptionPro,
} from "../lib/proInscriptionError";
import { DOCUMENTS_BY_METIER } from "../lib/professionalConfig";
import { toInternationalPhone } from "../lib/phone";
import type { RegisterProfessionnelValues } from "../schema/registerProfessionnel.schema";

/** Version des CGU acceptées en continuant (à faire évoluer avec les CGU) */
const VERSION_CGU = "1.0";

/** Champ du formulaire → type de document attendu par le serveur */
const TYPE_PAR_CHAMP: Record<string, TypeDocumentPro> = {
  carteProfessionnelle: "CARTE_PRO",
  diplome: "DIPLOME",
  pieceIdentite: "PIECE_IDENTITE",
};

export type ResultatInscriptionPro =
  | { ok: true }
  | ({ ok: false } & ErreurInscriptionPro);

export function useRegisterProfessionnel() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(
    values: RegisterProfessionnelValues,
  ): Promise<ResultatInscriptionPro> {
    setIsSubmitting(true);
    try {
      const { metier } = values;
      const juriste = metier === "JURISTE_CONSEIL";

      const fichiers: Partial<Record<TypeDocumentPro, File>> = {};
      for (const doc of DOCUMENTS_BY_METIER[metier].documents) {
        const liste = values[doc.field] as FileList | undefined;
        const fichier = liste?.[0];
        if (fichier) fichiers[TYPE_PAR_CHAMP[doc.field]] = fichier;
      }

      const session = await authApi.pro.inscription(
        {
          prenom: values.prenom.trim(),
          nom: values.nom.trim(),
          telephone: toInternationalPhone(values.telephone),
          email: values.email.trim(),
          motDePasse: values.password,
          confirmationMotDePasse: values.confirmPassword,
          cguAcceptees: true,
          versionCgu: VERSION_CGU,
          typeProfession: metier,
          ...(juriste ? {} : { matricule: values.numeroOrdre.trim() }),
          specialiteIds: values.specialites,
          declarationHonneur: juriste ? values.declarationHonneur : false,
          regionId: values.regionId,
          adresseCabinet: values.adresse.trim(),
          ...(values.latitude !== undefined && values.longitude !== undefined
            ? { latitude: values.latitude, longitude: values.longitude }
            : {}),
        },
        fichiers,
      );

      // Portée DOSSIER : accès à l'écran de suivi uniquement
      useAuthStore.getState().setSession(session);
      toast.success(
        "Demande d'inscription envoyée",
        "Confirmez votre adresse e-mail grâce au lien que nous venons de vous envoyer : sans cela, votre dossier ne peut pas être validé.",
      );
      return { ok: true };
    } catch (error) {
      const erreur = erreurInscriptionPro(error);
      if (!erreur.champ) toast.error(erreur.message);
      return { ok: false, ...erreur };
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}