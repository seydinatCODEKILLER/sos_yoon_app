import { useLogout } from "../hooks/useLogout";
import { useAuthStore } from "../store/auth.store";

export function DashboardPlaceholder() {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="p-8">
      <p>
        Connecté en tant que {user?.prenom} {user?.nom} ({user?.role})
      </p>
      <button onClick={() => logout()} disabled={isPending}>
        {isPending ? "Déconnexion..." : "Se déconnecter"}
      </button>
    </div>
  );
}
