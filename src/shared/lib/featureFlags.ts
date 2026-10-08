/**
 * ⚠️ TEMPORAIRE — back-end pas encore disponible.
 * Centralise l'activation du garde d'authentification pour ProtectedRoute
 * et RootGate, afin de n'avoir qu'un seul interrupteur à repasser à `true`
 * une fois l'API réelle connectée.
 */
export const AUTH_GUARD_ENABLED = false;

/** TEMPORAIRE : passe à `false` quand le back-end est connecté. */
export const USE_MOCK_API = true;