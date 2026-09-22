"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SCENARIOS } from "@/lib/scenarios";
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export async function startConversation(scenarioId?: string) {
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

  const scenario = SCENARIOS.find(s => s.id === scenarioId);
  const scenarioContext = scenario ? scenario.systemContext : '';

  const conversation = await prisma.conversation.create({
    data: {
      userId,
      language: profile.language,
      scenario: scenario ? scenario.name : null,
    },
  });

  if (scenarioContext) {
    const prompt = `Você é um professor de ${profile.language}. Cenário: ${scenarioContext}. Escreva APENAS a sua primeira frase (curta) saudando o aluno e iniciando o cenário. O idioma DEVE ser ${profile.language}. Nenhuma tradução, apenas a frase no idioma de estudo.`;
    
    const { text } = await generateText({
      model: groq(process.env.AI_MODEL || 'llama-3.1-8b-instant'),
      prompt,
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: text.replace(/"/g, ''), // remove possible quotes
      }
    });
  }

  redirect(`/conversar/${conversation.id}`);
}
