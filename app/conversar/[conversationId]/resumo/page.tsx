import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function SummaryPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { conversationId } = await params;

  const summary = await prisma.conversationSummary.findUnique({
    where: { conversationId },
    include: {
      conversation: true,
    }
  });

  if (!summary || summary.conversation.userId !== userId) {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Resumo da Conversa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Pontos Principais</h3>
            <p className="text-muted-foreground">{summary.mainPoints}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Vocabulário Destacado</h3>
            <div className="flex flex-wrap gap-2">
              {summary.newVocabulary.map((word, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {word}
                </Badge>
              ))}
              {summary.newVocabulary.length === 0 && (
                <span className="text-muted-foreground text-sm">Nenhum vocabulário novo destacado.</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/conversar" className="block w-full">
            <Button className="w-full">Iniciar Nova Conversa</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
