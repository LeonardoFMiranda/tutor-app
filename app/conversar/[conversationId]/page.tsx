import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { ChatInterface } from "@/components/chat/chat-interface";

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { conversationId } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation || conversation.userId !== userId) {
    redirect("/conversar");
  }

  return (
    <div className="flex-1 bg-muted/20">
      <ChatInterface conversationId={conversation.id} />
    </div>
  );
}
