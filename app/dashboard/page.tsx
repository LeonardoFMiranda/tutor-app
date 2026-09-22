import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId },
    include: {
      messages: {
        include: { corrections: true }
      },
      summary: true
    },
    orderBy: { createdAt: 'desc' }
  });

  if (conversations.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Tutor de Idiomas!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Você ainda não teve nenhuma conversa. Que tal começar a praticar agora mesmo?
        </p>
        <Button asChild size="lg">
          <Link href="/conversar">Começar a Praticar</Link>
        </Button>
      </div>
    );
  }

  let totalCorrections = 0;
  const categoryCount: Record<string, number> = {};
  const errorFrequency: Record<string, number> = {};
  
  const evolutionData = [...conversations].reverse().map((conv, index) => {
    let errCount = 0;
    conv.messages.forEach(m => {
      errCount += m.corrections.length;
      m.corrections.forEach(c => {
        totalCorrections++;
        categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
        errorFrequency[c.originalText] = (errorFrequency[c.originalText] || 0) + 1;
      });
    });
    return {
      name: `Conv ${index + 1}`,
      erros: errCount,
    };
  });

  const categoryData = Object.keys(categoryCount).map(key => ({
    name: key,
    valor: categoryCount[key]
  }));

  const topErrors = Object.entries(errorFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="container mx-auto p-4 space-y-8 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Seu Progresso</h1>
        <Button asChild>
          <Link href="/conversar">Nova Conversa</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Conversas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Erros Corrigidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCorrections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Idioma de Estudo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold capitalize">{profile.language}</div>
            <p className="text-xs text-muted-foreground mt-1">Nível: {profile.level}</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts evolutionData={evolutionData} categoryData={categoryData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Erros Recorrentes</CardTitle>
          </CardHeader>
          <CardContent>
            {topErrors.length > 0 ? (
              <ul className="space-y-4">
                {topErrors.map(([errorText, count], i) => (
                  <li key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <span className="font-medium text-destructive line-through decoration-destructive/50">{errorText}</span>
                    <span className="text-sm text-muted-foreground">{count} vezes</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhum erro registrado ainda. Ótimo trabalho!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Conversas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {conversations.slice(0, 5).map(conv => (
                <li key={conv.id} className="flex flex-col gap-1 border-b pb-3 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-semibold">{conv.scenario || "Conversa Livre"}</span>
                    <span className="text-xs text-muted-foreground">
                      {dateFormatter.format(new Date(conv.createdAt))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      {conv.summary ? "Resumo disponível" : "Em andamento / Sem resumo"}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={conv.summary ? `/conversar/${conv.id}/resumo` : `/conversar/${conv.id}`}>
                        {conv.summary ? "Ver Resumo" : "Continuar"}
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
