export function normalizeSnPhone(value: string): string {
  return value.replace(/[\s.-]/g, "").replace(/^(\+221|00221)/, "");
}

/** Numéro sénégalais : 9 chiffres commençant par 7 (mobile) ou 3 (fixe). */
export function isValidSnPhone(value: string): boolean {
  return /^[73]\d{8}$/.test(normalizeSnPhone(value));
}

/** 77 123 45 67 → +221771234567 (format exigé par le backend : ^\+[1-9]\d{6,14}$) */
export function toInternationalPhone(value: string): string {
  return `+221${normalizeSnPhone(value)}`;
}

/** +221771234567 → +221 77 123 45 67 */
export function formatInternationalPhone(value: string): string {
  const n = normalizeSnPhone(value);
  const m = n.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+221 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : `+221 ${n}`;
}