import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const { text } = await generateText({
      model: groq('openai/gpt-oss-120b'),
      prompt: 'Hello, how are you?',
    });
    console.log("Success: ", text);
  } catch (err) {
    console.error("Error generating text:", err);
  }
}
main();
