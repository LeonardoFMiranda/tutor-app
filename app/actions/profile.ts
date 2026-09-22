"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { profileSchema, ProfileValues } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveProfile(data: ProfileValues) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Não autorizado");
  }

  const parsed = profileSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Dados inválidos");
  }

  await prisma.profile.upsert({
    where: { userId },
    update: {
      language: parsed.data.language,
      level: parsed.data.level,
      goal: parsed.data.goal,
    },
    create: {
      userId,
      language: parsed.data.language,
      level: parsed.data.level,
      goal: parsed.data.goal,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  redirect("/dashboard");
}
