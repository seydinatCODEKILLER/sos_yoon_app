/** Refuse 0000, 1111, 1234, 4321… */
export function isCodeTrivial(code: string): boolean {
  if (/^(\d)\1+$/.test(code)) return true;
  const d = [...code].map(Number);
  const asc = d.every((n, i) => i === 0 || n === d[i - 1] + 1);
  const desc = d.every((n, i) => i === 0 || n === d[i - 1] - 1);
  return asc || desc;
}