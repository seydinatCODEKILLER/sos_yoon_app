import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { formaterDateLegale } from "../lib/infosLegales";
import { Texte } from "./Text";
import type { DocumentJuridique, Bloc } from "../types/legals.types";

interface Props {
  document: DocumentJuridique;
  /** L'autre document, proposé en bas de page. */
  autre: { libelle: string; vers: string };
}

/** Section actuellement lisible, pour surligner son entrée dans le sommaire. */
function useSectionActive(ids: string[]): string {
  const [actif, setActif] = useState(ids[0] ?? "");
  const cle = ids.join("|");

  useEffect(() => {
    const liste = cle ? cle.split("|") : [];
    const elements = liste.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (elements.length === 0 || typeof IntersectionObserver === "undefined") return;
    const observateur = new IntersectionObserver(
      (entrees) => {
        const visible = entrees.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActif(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px" },
    );
    elements.forEach((e) => observateur.observe(e));
    return () => observateur.disconnect();
  }, [cle]);

  return actif;
}

function BlocJuridique({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case "p":
      return (
        <p className="leading-7 text-ink/80">
          <Texte texte={bloc.texte} />
        </p>
      );
    case "sous-titre":
      return <h3 className="pt-2 text-sm font-bold text-ink">{bloc.texte}</h3>;
    case "liste":
      return (
        <ul className="space-y-2.5">
          {bloc.items.map((item, i) => (
            <li key={i} className="flex gap-3 leading-7 text-ink/80">
              <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-signal" />
              <span className="min-w-0">
                <Texte texte={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          <Texte texte={bloc.texte} />
        </p>
      );
  }
}

export function PageJuridique({ document: doc, autre }: Props) {
  const navigate = useNavigate();
  const actif = useSectionActive(doc.sections.map((s) => s.id));

  function retour() {
    // Ouvert depuis l'inscription dans le même onglet : on y retourne ; sinon, accueil.
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  }

  return (
    <div className="min-h-dvh bg-white text-ink">
      <div className="sticky top-0 z-20 border-b border-ink/10 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={retour}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink/70 outline-none hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-signal"
          >
            <ArrowLeft className="size-4" aria-hidden /> Retour
          </button>
          <Link to="/" className="text-sm font-bold tracking-tight text-navy">
            SOS Yoon
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink/70 outline-none hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-signal"
          >
            <Printer className="size-4" aria-hidden /> <span className="max-sm:sr-only">Imprimer</span>
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">{doc.titre}</h1>
          <p className="mt-3 text-sm text-ink/55">
            Version {doc.version} · mise à jour le {formaterDateLegale(doc.dateMiseAJour)}
          </p>
          <p className="mt-6 text-lg leading-8 text-ink/75">{doc.introduction}</p>
        </header>

        <aside
          aria-labelledby="essentiel"
          className="mt-8 max-w-3xl rounded-xl bg-orange-50/70 p-5 sm:p-6"
        >
          <h2 id="essentiel" className="text-sm font-bold text-ink">
            L'essentiel en quelques lignes
          </h2>
          <ul className="mt-3 space-y-2">
            {doc.resume.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm leading-6 text-ink/80">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />
                <span className="min-w-0">
                  <Texte texte={r} />
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mt-12 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Sommaire" className="print:hidden">
            {/* Mobile : sommaire replié ; bureau : colonne qui suit la lecture */}
            <details className="rounded-xl border border-ink/10 p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">Sommaire</summary>
              <ol className="mt-3 space-y-2 text-sm">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-ink/70 hover:text-signal">
                      {i + 1}. {s.titre}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
            <ol className="sticky top-24 hidden space-y-1 border-l border-ink/10 lg:block">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={actif === s.id ? "true" : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-5 transition-colors ${
                      actif === s.id
                        ? "border-signal font-semibold text-ink"
                        : "border-transparent text-ink/55 hover:text-ink"
                    }`}
                  >
                    {i + 1}. {s.titre}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 max-w-[68ch] space-y-12">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titre`} className="scroll-mt-24 space-y-4">
                <h2 id={`${s.id}-titre`} className="text-xl font-bold tracking-tight text-navy">
                  <span className="mr-2 text-signal tabular-nums">{i + 1}.</span>
                  {s.titre}
                </h2>
                {s.blocs.map((b, k) => (
                  <BlocJuridique key={k} bloc={b} />
                ))}
              </section>
            ))}

            <footer className="border-t border-ink/10 pt-8 text-sm text-ink/65 print:hidden">
              Voir aussi :{" "}
              <Link to={autre.vers} className="font-medium text-signal underline underline-offset-2">
                {autre.libelle}
              </Link>
            </footer>
          </article>
        </div>
      </main>
    </div>
  );
}