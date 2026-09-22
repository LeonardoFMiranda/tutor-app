import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const { object } = await generateObject({
      model: groq('openai/gpt-oss-120b'),
      schema: z.object({ summary: z.string() }),
      prompt: 'Summarize this: Hello how are you',
    });
    console.log("Success: ", object);
  } catch (err) {
    console.error("Error generating object:", err);
  }
}
main();
