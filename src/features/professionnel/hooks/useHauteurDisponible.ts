import { useLayoutEffect, useRef } from "react";

/** Plus grand dépassement vertical (en px) parmi la fenêtre et les conteneurs défilants parents */
function depassement(el: HTMLElement): number {
  let max = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  for (
    let parent = el.parentElement;
    parent && parent !== document.documentElement;
    parent = parent.parentElement
  ) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") {
      max = Math.max(max, parent.scrollHeight - parent.clientHeight);
    }
  }
  return max;
}

/**
 * Donne à l'élément toute la hauteur restante de la fenêtre, de sa position
 * jusqu'en bas, sans jamais faire apparaître de second défilement : seule la
 * liste des messages défile.
 *
 * On part de tout l'espace sous l'élément, puis on retire ce qui fait déborder
 * la page ou un conteneur parent (marges, éléments voisins). Cela fonctionne
 * quel que soit le layout autour, sans hauteur codée en dur. La barre de
 * défilement de la fenêtre est masquée tant que la page est affichée.
 */
export function useHauteurDisponible<T extends HTMLElement>(minimum = 448) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const racine: T = el;

    function mesurer() {
      const haut = racine.getBoundingClientRect().top;
      let hauteur = Math.max(Math.floor(window.innerHeight - haut), minimum);
      racine.style.height = `${hauteur}px`;
      for (let essai = 0; essai < 4; essai++) {
        const exces = Math.ceil(depassement(racine));
        if (exces <= 0 || hauteur <= minimum) break;
        hauteur = Math.max(hauteur - exces, minimum);
        racine.style.height = `${hauteur}px`;
      }
    }

    mesurer();
    // Le layout peut changer après le premier affichage (transition d'entrée,
    // polices, éléments qui apparaissent) : on remesure à ces moments-là
    const image = window.requestAnimationFrame(mesurer);
    const delais = [150, 500, 1500].map((ms) => window.setTimeout(mesurer, ms));
    const observateur =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(mesurer);
    observateur?.observe(document.body);
    window.addEventListener("resize", mesurer);

    // Dernier filet : cette page remplit déjà l'écran, la fenêtre n'a donc pas
    // à défiler. On retire sa barre tant que la page est affichée.
    const html = document.documentElement;
    const precedent = html.style.overflowY;
    html.style.overflowY = "hidden";

    return () => {
      window.cancelAnimationFrame(image);
      delais.forEach((d) => window.clearTimeout(d));
      observateur?.disconnect();
      window.removeEventListener("resize", mesurer);
      html.style.overflowY = precedent;
    };
  }, [minimum]);

  return ref;
}