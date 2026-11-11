import { Fragment } from "react";
import { Link } from "react-router-dom";

/**
 * Lien [libellé](url), **gras** ou [valeur à compléter]. Ce petit format évite d'écrire du JSX dans
 * les textes juridiques, que l'on relit et corrige souvent sans toucher au code.
 */
const MOTIF = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\[([^\]]+)\]/g;

export function Texte({ texte }: { texte: string }) {
  const morceaux: React.ReactNode[] = [];
  let curseur = 0;

  for (const m of texte.matchAll(MOTIF)) {
    const debut = m.index ?? 0;
    if (debut > curseur) morceaux.push(<Fragment key={morceaux.length}>{texte.slice(curseur, debut)}</Fragment>);

    const [, libelle, url, gras, aCompleter] = m;
    if (libelle && url) {
      morceaux.push(
        url.startsWith("/") ? (
          <Link key={morceaux.length} to={url} className="font-medium text-signal underline underline-offset-2">
            {libelle}
          </Link>
        ) : (
          <a key={morceaux.length} href={url} className="font-medium text-signal underline underline-offset-2">
            {libelle}
          </a>
        ),
      );
    } else if (gras) {
      morceaux.push(
        <strong key={morceaux.length} className="font-semibold text-ink">
          {gras}
        </strong>,
      );
    } else if (aCompleter) {
      morceaux.push(
        <mark key={morceaux.length} className="rounded bg-amber-200/70 px-1 text-ink" title="À compléter avant la mise en ligne">
          [{aCompleter}]
        </mark>,
      );
    }
    curseur = debut + m[0].length;
  }
  if (curseur < texte.length) morceaux.push(<Fragment key={morceaux.length}>{texte.slice(curseur)}</Fragment>);
  return <>{morceaux}</>;
}