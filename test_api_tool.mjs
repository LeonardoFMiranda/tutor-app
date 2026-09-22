import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const { POST } = await import('./app/api/chat/route.ts');
  
  // Create a mock conversation in DB or just bypass DB for this specific test
  // Since we need DB, let's fetch an existing conversation.
  const db = (await import('./lib/db.ts')).default;
  let conv = await db.conversation.findFirst({
    include: { messages: true }
  });
  
  if (!conv) {
    console.log("No conv"); return;
  }
  
  const req = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId: conv.id,
      messages: [
        { role: 'user', content: 'hi! i would like to apply to the software developer position because i think im very valueable to the team i have a solid carrer' }
      ]
    })
  });
  
  try {
    const res = await POST(req);
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Stream output:");
    console.log(text);
  } catch (err) {
    console.error("Error:", err);
  }
}

main().catch(console.error);
