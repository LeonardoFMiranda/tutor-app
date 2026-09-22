import { groq } from '@ai-sdk/groq';
import { streamText, convertToCoreMessages } from 'ai';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages, conversationId } = await req.json();

  if (!conversationId) {
    return new Response('Missing conversationId', { status: 400 });
  }

  // Fetch conversation and profile
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation || conversation.userId !== userId) {
    return new Response('Conversation not found', { status: 404 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return new Response('Profile not found', { status: 404 });
  }

  // Save the latest user message
  const latestUserMessage = messages[messages.length - 1];
  if (latestUserMessage && latestUserMessage.role === 'user') {
    await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: latestUserMessage.content,
      },
    });
  }

  const systemPrompt = `Você é um parceiro de conversação e professor de ${profile.language}. Converse naturalmente no nível ${profile.level} do usuário${conversation.scenario ? `, mantendo o cenário: ${conversation.scenario}` : ''}. O objetivo principal do usuário é: ${profile.goal}. Use vocabulário e estruturas adequados ao nível informado. Seja encorajador. Responda sempre no idioma de estudo, a menos que o usuário peça explicitamente para explicar algo em português. Mantenha suas respostas curtas e focadas na conversação.`;

  const modelName = process.env.AI_MODEL || 'llama-3.1-8b-instant';

  const result = await streamText({
    model: groq(modelName),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    onFinish: async ({ text }) => {
      // Save assistant message when done
      await prisma.message.create({
        data: {
          conversationId,
          role: 'assistant',
          content: text,
        },
      });
    },
  });

  return result.toDataStreamResponse();
}
