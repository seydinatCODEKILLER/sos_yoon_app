import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordFormValues } from "../schema/profil.schema";

// TODO(back-end): remplacer par un vrai appel authApi/profilApi une fois
// l'endpoint disponible. Le mock simule juste une latence réseau.
async function mockChangePassword(
  values: ChangePasswordFormValues,
): Promise<{ success: true }> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (import.meta.env.DEV) {
    console.log("🔧 [mock] Changement de mot de passe :", values);
  }

  return { success: true };
}

export function useChangePassword() {
  return useMutation({
    mutationFn: mockChangePassword,
  });
}
