import { useState } from "react";

export type VueListe = "TABLEAU" | "CARTES";

/**
 * Vue choisie (tableau ou cartes), retenue par écran dans le navigateur.
 * Le stockage peut être indisponible (navigation privée, données bloquées) : on retombe
 * alors sur la valeur par défaut sans rien casser.
 */
export function useVueListe(cle: string, parDefaut: VueListe = "TABLEAU") {
  const cleStockage = `sosyoon.vue.${cle}`;
  const [vue, setVueEtat] = useState<VueListe>(() => {
    try {
      const v = window.localStorage.getItem(cleStockage);
      return v === "TABLEAU" || v === "CARTES" ? v : parDefaut;
    } catch {
      return parDefaut;
    }
  });

  function setVue(v: VueListe) {
    setVueEtat(v);
    try {
      window.localStorage.setItem(cleStockage, v);
    } catch {
      /* préférence non retenue : sans conséquence */
    }
  }

  return [vue, setVue] as const;
}