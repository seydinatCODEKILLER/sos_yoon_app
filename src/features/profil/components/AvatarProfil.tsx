import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "@/shared/lib/toast";

const TYPES_ACCEPTES = ["image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX = 10 * 1024 * 1024; // 10 Mo avant réduction

interface AvatarProfilProps {
  photoUrl: string | null;
  initiales: string;
  occupe: boolean;
  onFichier: (fichier: File) => void;
}

export function AvatarProfil({
  photoUrl,
  initiales,
  occupe,
  onFichier,
}: AvatarProfilProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const choisi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    // Permet de re-sélectionner le même fichier plus tard
    e.target.value = "";
    if (!fichier) return;

    if (!TYPES_ACCEPTES.includes(fichier.type)) {
      toast.error("Format non pris en charge. Utilisez une image JPG, PNG ou WebP.");
      return;
    }
    if (fichier.size > TAILLE_MAX) {
      toast.error("Image trop lourde (10 Mo maximum).");
      return;
    }
    onFichier(fichier);
  };

  return (
    <div className="relative shrink-0">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Votre photo de profil"
          className="size-20 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="grid size-20 place-items-center rounded-full bg-violet-100 text-xl font-semibold text-navy"
        >
          {initiales}
        </span>
      )}

      {occupe && (
        <span className="absolute inset-0 grid place-items-center rounded-full bg-ink/45">
          <Loader2 className="size-6 animate-spin text-white" aria-label="Envoi en cours" />
        </span>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={occupe}
        aria-label="Changer la photo de profil"
        className="absolute -right-1 -bottom-1 grid size-8 place-items-center rounded-full bg-navy text-paper ring-2 ring-white transition hover:brightness-110 disabled:opacity-60"
      >
        <Camera className="size-4" aria-hidden />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={choisi}
        className="hidden"
        tabIndex={-1}
      />
    </div>
  );
}