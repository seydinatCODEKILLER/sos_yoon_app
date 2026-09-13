import { z } from "zod";

export const verifyOtpSchema = z.object({
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
});

export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;