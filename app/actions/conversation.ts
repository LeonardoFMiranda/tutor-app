"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function startConversation(scenario?: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Não autorizado");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const conversation = await prisma.conversation.create({
    data: {
      userId,
      language: profile.language,
      scenario: scenario || null,
    },
  });

  redirect(`/conversar/${conversation.id}`);
}
