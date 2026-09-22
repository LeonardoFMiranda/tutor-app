import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const result = await streamText({
      model: groq('openai/gpt-oss-120b'),
      system: 'You are a helpful assistant.',
      messages: [{ role: 'user', content: 'hello' }],
      tools: {
        myTool: tool({
          description: 'A tool',
          parameters: z.object({ foo: z.string() }),
          execute: async ({ foo }) => foo
        })
      }
    });
    
    let text = "";
    for await (const delta of result.textStream) {
      text += delta;
    }
    console.log("Success:", text);
  } catch (err) {
    console.error("Error generating stream:", err.message);
  }
}
main();
