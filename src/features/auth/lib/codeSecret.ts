/**
 * Miroir exact de la règle du backend (codeTrivial) : sont refusés
 *  - quatre chiffres identiques      0000, 1111…
 *  - suite croissante                1234, 5678…
 *  - suite décroissante              4321, 9876…
 *  - deux chiffres répétés           1212, 3737…
 * Si le front accepte un code que le backend refuse, l'utilisateur ne le saura
 * qu'à la dernière étape (422 CODE_SECRET_TROP_SIMPLE).
 */
export function isCodeTrivial(code: string): boolean {
  if (!/^\d{4}$/.test(code)) return false;
  const d = [...code].map(Number);

  const identiques = d.every((x) => x === d[0]);
  const croissant = d.every((x, i) => i === 0 || x === d[i - 1] + 1);
  const decroissant = d.every((x, i) => i === 0 || x === d[i - 1] - 1);
  const repetition = d[0] === d[2] && d[1] === d[3];

  return identiques || croissant || decroissant || repetition;
}