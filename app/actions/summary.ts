"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

const summarySchema = z.object({
  mainPoints: z.string().describe("Resumo dos principais pontos abordados na conversa."),
  newVocabulary: z.array(z.string()).describe("Lista de palavras novas ou importantes que apareceram na conversa no idioma de estudo."),
});

export async function generateConversationSummary(conversationId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Não autorizado");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      summary: true,
    },
  });

  if (!conversation || conversation.userId !== userId) {
    throw new Error("Conversa não encontrada");
  }

  if (conversation.summary) {
    redirect(`/conversar/${conversationId}/resumo`);
  }

  const chatText = conversation.messages.map(m => `${m.role}: ${m.content}`).join("\n");

  if (chatText.trim().length === 0) {
    redirect("/conversar"); // Sem mensagens para resumir
  }

  const { object } = await generateObject({
    model: groq(process.env.AI_MODEL || "llama-3.1-8b-instant"),
    schema: summarySchema,
    prompt: `Resuma a seguinte conversa entre um estudante de ${conversation.language} (user) e um professor (assistant).\n\nConversa:\n${chatText}`,
  });

  await prisma.conversationSummary.create({
    data: {
      conversationId: conversation.id,
      mainPoints: object.mainPoints,
      newVocabulary: object.newVocabulary,
    },
  });

  redirect(`/conversar/${conversationId}/resumo`);
}
