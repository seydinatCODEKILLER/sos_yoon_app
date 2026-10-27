const chiffres = (t: string) => t.replace(/\D/g, "");

/** « +221 77 845 12 30 » pour les numéros sénégalais, tel quel sinon */
export function formaterTelephone(telephone: string) {
  const d = chiffres(telephone);
  if (d.startsWith("221") && d.length === 12) {
    const r = d.slice(3);
    return `+221 ${r.slice(0, 2)} ${r.slice(2, 5)} ${r.slice(5, 7)} ${r.slice(7)}`;
  }
  return telephone;
}

export function messageWhatsApp(nomPro: string, reference: string) {
  return `Bonjour, je suis ${nomPro}. J'ai pris en charge votre demande ${reference} sur SOS Yoon. Quand pouvons-nous échanger ?`;
}

export function lienWhatsApp(telephone: string, message: string) {
  return `https://wa.me/${chiffres(telephone)}?text=${encodeURIComponent(message)}`;
}

export function lienAppel(telephone: string) {
  return `tel:+${chiffres(telephone)}`;
}