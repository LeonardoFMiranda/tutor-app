import * as z from "zod";

export const profileSchema = z.object({
  language: z.string().min(1, "Selecione um idioma"),
  level: z.string().min(1, "Selecione seu nível"),
  goal: z.string().min(1, "Selecione seu objetivo"),
});

export type ProfileValues = z.infer<typeof profileSchema>;
