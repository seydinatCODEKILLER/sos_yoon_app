import { RefreshCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { toast } from "@/shared/lib/toast";
import { useRelancerDemande } from "../hooks/useDemandesAdmin";
import { messageAdmin } from "../lib/erreursAdmin";
import type { DemandeAdmin } from "../types/demandes.types";

interface Props {
  cible: DemandeAdmin | null;
  onFermer: () => void;
}

export function DialogRelancerDemande({ cible, onFermer }: Props) {
  return (
    <Dialog open={!!cible} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        {cible && <Formulaire key={cible.id} cible={cible} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}

function Formulaire({ cible, onFermer }: { cible: DemandeAdmin; onFermer: () => void }) {
  const { mutate, isPending, error } = useRelancerDemande();

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pr-12 text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10">
          <RefreshCcw className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">Relancer la recherche ?</DialogTitle>
          <DialogDescription>
            Le système sollicite à nouveau des professionnels pour la demande{" "}
            <strong className="font-semibold text-foreground tabular-nums">{cible.reference ?? "sans référence"}</strong>.
            Utile quand personne n'a répondu ou que la recherche s'est arrêtée.
          </DialogDescription>
        </div>
      </DialogHeader>

      {error && (
        <p role="alert" className="px-6 pb-4 text-sm text-destructive">
          {messageAdmin(error, "Impossible de relancer la recherche.")}
        </p>
      )}

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button
          disabled={isPending}
          onClick={() =>
            mutate(cible.id, {
              onSuccess: () => {
                toast.success("Recherche relancée", "Les professionnels vont être sollicités.");
                onFermer();
              },
            })
          }
        >
          {isPending ? "En cours…" : "Relancer la recherche"}
        </Button>
      </DialogFooter>
    </>
  );
}