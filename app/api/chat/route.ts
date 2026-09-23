import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, generateObject } from 'ai';
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

  const modelName = process.env.AI_MODEL || 'openai/gpt-oss-120b';

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

    if (messageContent.trim()) {
      generateObject({
        model: groq(modelName),
        system: 'You are a grammar evaluator. Analyze the user text and list any grammatical, vocabulary, or spelling errors in the language they are studying. Return an empty array if there are no errors. Explain errors in Portuguese.',
        prompt: messageContent,
        schema: z.object({
          corrections: z.array(z.object({
            originalText: z.string().describe("The exact substring in the user's message that has an error"),
            correctedText: z.string().describe("The suggested correction"),
            explanation: z.string().describe("Short explanation of the error in Portuguese"),
            category: z.enum(['GRAMMAR', 'VOCABULARY', 'NATURALNESS', 'SPELLING'])
          }))
        })
      }).then(async (result) => {
        if (result.object.corrections.length > 0) {
          await prisma.correction.createMany({
            data: result.object.corrections.map(c => ({
              ...c,
              messageId: savedUserMessageId
            }))
          });
        }
      }).catch(err => console.error('Error in grammar check:', err));
    }
  }

  const systemPrompt = `Você é um tutor nativo de ${profile.language} e está simulando o seguinte cenário com o usuário: ${conversation.scenario || 'conversa livre'}.
O usuário está no nível ${profile.level} e quer: ${profile.goal}.

REGRAS:
1. Responda à mensagem do usuário de forma natural e curta (1-2 frases), mantendo o cenário ativo.
2. SEMPRE analise a mensagem do usuário em busca de erros gramaticais, vocabulário inadequado ou frases que soa artificiais para um nativo.
3. SE houver algo a melhorar, adicione um bloco de feedback DEPOIS da sua resposta, no seguinte formato EXATO:

---
💡 **Dica de inglês:**
✏️ Você disse: *"[frase original do usuário]*"
✅ Poderia dizer: *"[versão melhorada]*"

[Explicação do ponto mais importante em português, de forma simpática e encorajadora, como um professor particular. Mencione a regra gramatical ou dica de vocabulário de forma clara.]
---

4. Se a frase do usuário estiver perfeita, NÃO adicione o bloco de dica, apenas responda normalmente.
5. NUNCA quebre o personagem do cenário na sua resposta principal. O feedback é separado.
6. Responda SEMPRE em ${profile.language}, exceto no bloco de dica (que é em português).`;


  const result = await streamText({
    model: groq(modelName),
    system: systemPrompt,
    messages: await convertToModelMessages(messages.map((m: any) => ({
      ...m,
      parts: m.parts || [{ type: 'text', text: m.content || '' }]
    }))),
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
