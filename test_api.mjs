import * as dotenv from 'dotenv';
dotenv.config();
import prisma from './lib/db.ts';

async function main() {
  const db = (await import('./lib/db.ts')).default;
  const conv = await db.conversation.findFirst({
    include: { messages: true }
  });
  
  if (!conv) {
    console.log("No conversations found.");
    return;
  }
  
  console.log("Testing POST /api/chat with conversationId:", conv.id);
  
  // Note: we can't directly call POST without setting up a Request object.
  // We can just import POST from route.ts
  const { POST } = await import('./app/api/chat/route.ts');
  
  const req = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId: conv.id,
      messages: [
        { role: 'user', content: 'hello' } // v7 structure
      ]
    })
  });
  
  try {
    const res = await POST(req);
    console.log("Response Status:", res.status);
    console.log("Response Body:", await res.text());
  } catch (err) {
    console.error("Uncaught Error:", err);
  }
}

main().catch(console.error);
