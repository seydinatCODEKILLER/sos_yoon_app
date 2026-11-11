import { useEffect, useState } from "react";
import { Search, UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { useProfessionnelsAdmin } from "../hooks/useProfessionnelsAdmin";
import { useReaffecterDemande } from "../hooks/useDemandesAdmin";
import { messageAdmin } from "../lib/erreursAdmin";
import { METIERS_PRO, statutAffichage } from "../lib/professionnels";
import type { DemandeAdmin } from "../types/demandes.types";
import { AvatarPro, DisponibilitePro } from "./ElementsProfessionnel";

interface Props {
  cible: DemandeAdmin | null;
  onFermer: () => void;
}

export function DialogReaffecterDemande({ cible, onFermer }: Props) {
  return (
    <Dialog open={!!cible} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {cible && <Formulaire key={cible.id} cible={cible} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}

function Formulaire({ cible, onFermer }: { cible: DemandeAdmin; onFermer: () => void }) {
  const [saisie, setSaisie] = useState("");
  const [q, setQ] = useState("");
  const [choisi, setChoisi] = useState<string | null>(null);
  const [motif, setMotif] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQ(saisie.trim()), 300);
    return () => clearTimeout(t);
  }, [saisie]);

  // Seuls les professionnels validés sont candidats ; les suspendus sont écartés ci-dessous.
  const { data, isFetching, isError } = useProfessionnelsAdmin({
    q,
    statut: "VALIDE",
    metier: "TOUS",
    page: 0,
    taille: 20,
  });
  const { mutate, isPending, error } = useReaffecterDemande();

  const candidats = (data?.contenu ?? [])
    .filter((p) => statutAffichage(p) === "VALIDE" && p.nomComplet !== cible.professionnel)
    // Les professions demandées passent en premier.
    .sort((a, b) => Number(cible.metiers.includes(b.typeProfession)) - Number(cible.metiers.includes(a.typeProfession)));

  const valide = choisi !== null && motif.trim().length >= 3;

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy/10 text-navy dark:bg-white/10 dark:text-white">
          <UserCheck className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">Attribuer à un professionnel</DialogTitle>
          <DialogDescription>
            Demande <strong className="font-semibold text-foreground tabular-nums">{cible.reference ?? "sans référence"}</strong>.
            Le professionnel choisi la prend en charge immédiatement, sans avoir à l'accepter.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-5 px-6 pb-6">
        <div className="space-y-2">
          <Label htmlFor="recherche-pro">Professionnel</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="recherche-pro"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder="Nom, téléphone, e-mail…"
              className="pl-9"
            />
          </div>

          <ul
            className={cn("max-h-56 space-y-1.5 overflow-y-auto", isFetching && "opacity-60 transition-opacity")}
            aria-label="Professionnels disponibles"
          >
            {isError && <li className="p-3 text-sm text-destructive">Impossible de charger les professionnels.</li>}
            {!isError && !data && <li className="h-14 animate-pulse rounded-xl bg-muted" />}
            {data && candidats.length === 0 && (
              <li className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                Aucun professionnel actif ne correspond.
              </li>
            )}
            {candidats.map((p) => {
              const selectionne = choisi === p.id;
              const correspond = cible.metiers.includes(p.typeProfession);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={selectionne}
                    onClick={() => setChoisi(p.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal/50",
                      selectionne ? "border-navy bg-navy/4 ring-1 ring-navy" : "border-border hover:bg-muted/50",
                    )}
                  >
                    <AvatarPro nomComplet={p.nomComplet} etat="VALIDE" photoUrl={p.photoUrl} className="size-9" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.nomComplet}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {METIERS_PRO[p.typeProfession]?.libelle ?? p.typeProfession}
                        {p.specialiteDominante ? ` · ${p.specialiteDominante}` : ""}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      {correspond && (
                        <span className="rounded-md bg-signal/10 px-1.5 py-0.5 text-[11px] font-semibold text-signal">
                          Profession demandée
                        </span>
                      )}
                      <DisponibilitePro dispo={p.disponible} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="motif-reaffectation">
            Motif de l'attribution <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="motif-reaffectation"
            rows={2}
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Ex : professionnel précédent suspendu, aucun avocat disponible dans la zone."
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Enregistré dans le journal d'audit. Le citoyen et le professionnel sont prévenus.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messageAdmin(error, "Impossible d'attribuer cette demande.")}
          </p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button
          disabled={!valide || isPending}
          onClick={() =>
            mutate(
              { id: cible.id, payload: { professionnelId: choisi as string, motif: motif.trim() } },
              { onSuccess: onFermer },
            )
          }
        >
          <UserCheck className="size-4" aria-hidden />
          {isPending ? "En cours…" : "Attribuer la demande"}
        </Button>
      </DialogFooter>
    </>
  );
}