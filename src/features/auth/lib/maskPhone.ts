/** « +221771234567 » → « +221 77 ••• •• 67 » */
export function maskPhone(international: string): string {
  const m = international.match(/^(\+\d{3})(\d{2})(\d+)(\d{2})$/);
  return m ? `${m[1]} ${m[2]} ••• •• ${m[4]}` : international;
}