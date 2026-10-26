/** Fond des cartes : dégradé discret blanc → marine, pour se détacher de la page */
const FOND = "border-ink/10 bg-linear-to-br from-white to-navy/6 shadow-sm";

/** Carte enveloppée par un lien (utilise le `group` du lien) */
export const CARTE_LIEN = `${FOND} transition-[box-shadow,border-color] duration-200 group-hover:border-ink/20 group-hover:shadow-md`;

/** Carte qui est elle-même cliquable (bouton) */
export const CARTE_BOUTON = `${FOND} transition-[box-shadow,border-color] duration-200 hover:border-ink/20 hover:shadow-md`;

/** Carte statique (non cliquable) */
export const CARTE = FOND;