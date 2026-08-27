import { AxiosError } from "axios";

interface KnownErrorShape {
  message?: string;
  error?: string;
}

const DEFAULT_MESSAGE = "Une erreur est survenue. Veuillez réessayer.";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as KnownErrorShape | undefined;
    return data?.message ?? data?.error ?? error.message ?? DEFAULT_MESSAGE;
  }
  if (error instanceof Error) return error.message;
  return DEFAULT_MESSAGE;
}
