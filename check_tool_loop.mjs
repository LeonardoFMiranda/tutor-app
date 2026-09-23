import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const result = await streamText({
      model: groq('openai/gpt-oss-120b'),
      system: 'You must ALWAYS call the tool "myTool" before saying anything. After the tool returns, say "Tool was called successfully."',
      messages: [{ role: 'user', content: 'test' }],
      maxSteps: 2,
      tools: {
        myTool: tool({
          description: 'A tool that must be called',
          parameters: z.object({ foo: z.string() }),
          execute: async ({ foo }) => {
            console.log("TOOL EXECUTED WITH:", foo);
            return "ok";
          }
        })
      }
    });
    
    let text = "";
    for await (const delta of result.textStream) {
      text += delta;
      process.stdout.write(delta);
    }
    console.log("\nSuccess:", text);
  } catch (err) {
    console.error("Error generating stream:", err.message);
  }
}
main();
