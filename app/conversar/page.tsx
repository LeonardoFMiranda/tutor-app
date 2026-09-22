import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { startConversation } from "@/app/actions/conversation";
import { Button } from "@/components/ui/button";

export default async function ConversarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-4">Escolha um cenário ou inicie uma conversa livre</h1>
      <form action={async () => {
        "use server";
        await startConversation();
      }}>
        <Button size="lg" type="submit">Iniciar Conversa Livre</Button>
      </form>
    </div>
  );
}
