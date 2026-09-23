import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const result = await generateObject({
      model: groq('openai/gpt-oss-120b'),
      system: 'Analise o texto e liste erros gramaticais.',
      prompt: 'hi im very valueable carrer',
      schema: z.object({
        corrections: z.array(z.object({
          originalText: z.string(),
          correctedText: z.string(),
          explanation: z.string(),
          category: z.enum(['GRAMMAR', 'VOCABULARY', 'NATURALNESS', 'SPELLING'])
        }))
      })
    });
    console.log("Corrections:", result.object.corrections);
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
