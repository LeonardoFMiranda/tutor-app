import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, tool } from 'ai';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import { ratelimit } from '@/lib/ratelimit';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (ratelimit) {
    const { success } = await ratelimit.limit(userId);
    if (!success) {
      return new Response('Too Many Requests', { status: 429 });
    }
  }

  const body = await req.json();
  console.log("INCOMING CHAT REQUEST:", body);
  const { messages, conversationId } = body;

  if (!conversationId) {
    return new Response('Missing conversationId', { status: 400 });
  }

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

  const latestUserMessage = messages[messages.length - 1];
  let savedUserMessageId = '';
  
  if (latestUserMessage && latestUserMessage.role === 'user') {
    const messageContent = latestUserMessage.content || (latestUserMessage.parts ? latestUserMessage.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\\n') : '');
    const savedMsg = await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: messageContent,
      },
    });
    savedUserMessageId = savedMsg.id;
  }

  const systemPrompt = `Você é um parceiro de conversação e professor de ${profile.language}. Converse naturalmente no nível ${profile.level} do usuário${conversation.scenario ? `, mantendo o cenário: ${conversation.scenario}` : ''}. O objetivo principal do usuário é: ${profile.goal}.
SE o usuário cometer ERROS gramaticais, de vocabulário ou falta de naturalidade na última mensagem, você DEVE SEMPRE chamar a tool 'reportCorrections' antes de responder com texto. Se a frase estiver perfeita, não chame a tool.
Após chamar a tool (ou se não houver erros), responda de forma encorajadora no idioma de estudo, mantendo suas respostas curtas e focadas na conversação.`;

  const modelName = process.env.AI_MODEL || 'openai/gpt-oss-120b';

  const result = await streamText({
    model: groq(modelName),
    system: systemPrompt,
    messages: await convertToModelMessages(messages.map((m: any) => ({
      ...m,
      parts: m.parts || [{ type: 'text', text: m.content || '' }]
    }))),
    maxSteps: 2,
    tools: {
      reportCorrections: tool({
        description: 'Report grammatical, vocabulary, or naturalness corrections for the user\'s LAST message. Call this if there are errors, before answering.',
        parameters: z.object({
          corrections: z.array(z.object({
            originalText: z.string().describe("The exact substring in the user's message that has an error"),
            correctedText: z.string().describe("The suggested correction"),
            explanation: z.string().describe("Short explanation of the error in Portuguese"),
            category: z.enum(['GRAMMAR', 'VOCABULARY', 'NATURALNESS', 'SPELLING'])
          }))
        }),
        execute: async ({ corrections }) => {
          if (savedUserMessageId && corrections.length > 0) {
            await prisma.correction.createMany({
              data: corrections.map(c => ({
                originalText: c.originalText,
                correctedText: c.correctedText,
                explanation: c.explanation,
                category: c.category,
                messageId: savedUserMessageId
              }))
            });
          }
          return { success: true, count: corrections.length };
        }
      })
    },
    onFinish: async ({ text }) => {
      if (text) {
        await prisma.message.create({
          data: {
            conversationId,
            role: 'assistant',
            content: text,
          },
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
