import { ArrowUp } from "lucide-react";

const columns = [
  {
    title: "Produit",
    links: [
      { label: "Comment ça marche", href: "#comment-ca-marche" },
      { label: "Nos métiers", href: "#" },
      { label: "Confiance & sécurité", href: "#" },
    ],
  },
  {
    title: "Professionnels",
    links: [
      { label: "Rejoindre le réseau", href: "#" },
      { label: "Espace pro", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Confidentialité", href: "#" },
      { label: "Conditions d'utilisation", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-paper/10 bg-ink pt-16 text-paper/60">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 pb-12 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              <span className="font-display text-lg text-paper">SOS Yoon</span>
            </div>
            <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-paper/45">
              Le bon professionnel du droit, en quelques minutes.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-medium uppercase tracking-widest text-paper/35">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-paper/60 transition-colors hover:text-signal"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-paper/10 py-6 sm:flex-row">
          <p className="text-sm text-paper/40">
            © {new Date().getFullYear()} SOS Yoon. Tous droits réservés.
          </p>

          <a
            href="#top"
            className="group flex items-center gap-2 text-sm text-paper/50 transition-colors hover:text-signal"
          >
            Haut de page
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-paper/15 transition-colors group-hover:border-signal/40">
              <ArrowUp
                size={13}
                className="transition-transform group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
