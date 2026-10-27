import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Button } from "@/shared/components/ui/button";
import { getDisplayName } from "@/shared/lib/userDisplay";
import { lienAppel, lienWhatsApp, messageWhatsApp } from "../lib/contactClient";

interface BoutonsContactClientProps {
  telephone: string;
  /** Référence de la demande, insérée dans le message WhatsApp */
  reference: string;
  className?: string;
}

/** Utilisé dans la fenêtre d'acceptation et, plus tard, dans le détail du dossier. */
export function BoutonsContactClient({
  telephone,
  reference,
  className = "",
}: BoutonsContactClientProps) {
  const user = useAuthStore((s) => s.user);
  const message = messageWhatsApp(getDisplayName(user), reference);

  return (
    <div className={`grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] ${className}`}>
      <Button
        size="lg"
        nativeButton={false}
        render={
          <a
            href={lienWhatsApp(telephone, message)}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        className="h-12 rounded-xl bg-signal px-5 font-semibold text-white hover:bg-signal/90"
      >
        <MessageCircle className="size-5" aria-hidden />
        Contacter sur WhatsApp
        <ArrowRight className="size-4" aria-hidden />
      </Button>

      <Button
        size="lg"
        nativeButton={false}
        render={<a href={lienAppel(telephone)} />}
        className="h-12 rounded-xl bg-navy px-5 font-semibold text-white hover:bg-navy/90"
      >
        <Phone className="size-4" aria-hidden />
        Appeler le client
      </Button>
    </div>
  );
}