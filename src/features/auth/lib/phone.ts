export function normalizeSnPhone(value: string): string {
  return value.replace(/[\s.-]/g, "").replace(/^(\+221|00221)/, "");
}

export function toInternationalPhone(value: string): string {
  return `+221${normalizeSnPhone(value)}`;
}

/** +221771234567 → +221 77 123 45 67 */
export function formatInternationalPhone(value: string): string {
  const n = normalizeSnPhone(value);
  const m = n.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+221 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : `+221 ${n}`;
}