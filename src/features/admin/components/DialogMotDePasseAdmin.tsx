import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
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
import { useChangerMotDePasseAdmin } from "../hooks/useParametresAdmin";
import { motDePasseAdminSchema, type MotDePasseAdminValeurs } from "../schema/parametresAdmin.schema";

interface Props {
  ouvert: boolean;
  onFermer: () => void;
  onSucces: () => void;
}

export function DialogMotDePasseAdmin({ ouvert, onFermer, onSucces }: Props) {
  return (
    <Dialog open={ouvert} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        {ouvert && <Formulaire onFermer={onFermer} onSucces={onSucces} />}
      </DialogContent>
    </Dialog>
  );
}

function Formulaire({ onFermer, onSucces }: Pick<Props, "onFermer" | "onSucces">) {
  const [visible, setVisible] = useState(false);
  const { mutate, isPending } = useChangerMotDePasseAdmin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MotDePasseAdminValeurs>({ resolver: zodResolver(motDePasseAdminSchema) });

  function envoyer(v: MotDePasseAdminValeurs) {
    mutate(
      { ancienMotDePasse: v.ancien, nouveauMotDePasse: v.nouveau },
      {
        onSuccess: () => {
          onSucces();
          onFermer();
        },
        onError: (e) => {
          const code = (e as { code?: string }).code;
          if (code === "ANCIEN_MOT_DE_PASSE_INCORRECT")
            setError("ancien", { message: "Le mot de passe actuel est incorrect." });
          else setError("root", { message: (e as { message?: string }).message ?? "Une erreur est survenue." });
        },
      },
    );
  }

  const type = visible ? "text" : "password";

  return (
    <form onSubmit={handleSubmit(envoyer)} noValidate>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal">
          <KeyRound className="size-5" />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">Mettre à jour le mot de passe</DialogTitle>
          <DialogDescription>
            8 caractères minimum, avec au moins un chiffre et un symbole.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-4 px-6 pb-6">
        <Champ id="ancien" label="Mot de passe actuel" erreur={errors.ancien?.message}>
          <Input id="ancien" type={type} autoComplete="current-password" {...register("ancien")} />
        </Champ>
        <Champ id="nouveau" label="Nouveau mot de passe" erreur={errors.nouveau?.message}>
          <Input id="nouveau" type={type} autoComplete="new-password" {...register("nouveau")} />
        </Champ>
        <Champ id="confirmation" label="Confirmer le nouveau mot de passe" erreur={errors.confirmation?.message}>
          <Input id="confirmation" type={type} autoComplete="new-password" {...register("confirmation")} />
        </Champ>

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {visible ? "Masquer les mots de passe" : "Afficher les mots de passe"}
        </button>

        {errors.root && (
          <p role="alert" className="text-sm text-destructive">{errors.root.message}</p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button type="button" variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "En cours…" : "Mettre à jour"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function Champ({ id, label, erreur, children }: { id: string; label: string; erreur?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {erreur && <p className="text-xs text-destructive">{erreur}</p>}
    </div>
  );
}