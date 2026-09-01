import { ArrowUp, ArrowRight } from "lucide-react";

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
    <footer className="relative overflow-hidden border-t border-paper/10 bg-ink text-paper/60">
      {/* grille tactique, cohérente avec la section problème */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* glow signal, ancré en haut à gauche */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-0 h-72 w-72 rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--color-signal)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* bandeau CTA */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-paper/10 py-14 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-2xl leading-tight text-paper md:text-3xl">
              Une urgence à traiter ?{" "}
              <span className="text-paper/40">Ne cherchez plus.</span>
            </h3>
          </div>
          <a
            href="/login"
            className="group flex shrink-0 items-center gap-2 rounded bg-signal px-5 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Décrire mon urgence
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* colonnes */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">
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
                      className="group inline-flex items-center gap-1.5 text-sm text-paper/60 transition-colors hover:text-signal"
                    >
                      <span className="h-1 w-1 rounded-full bg-paper/20 transition-colors group-hover:bg-signal" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* barre du bas */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-paper/10 py-6 sm:flex-row">
          <p className="font-mono text-xs text-paper/30">
            © {new Date().getFullYear()} SOS Yoon — Tous droits réservés.
          </p>
          <a
            href="#top"
            className="group flex items-center gap-2 text-sm text-paper/50 transition-colors hover:text-signal"
          >
            Haut de page
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-paper/15 transition-colors group-hover:border-signal/40 group-hover:bg-signal/10">
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
