import { useDemandeEnAttente } from "../store/demandeEnAttente.store";
import { supprimerAudio } from "./stockageAudio";

/** Efface la demande conservée et son enregistrement vocal */
export async function viderDemandeEnAttente(): Promise<void> {
  useDemandeEnAttente.getState().vider();
  await supprimerAudio();
}