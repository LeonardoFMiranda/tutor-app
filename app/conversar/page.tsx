import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { startConversation } from "@/app/actions/conversation";
import { Button } from "@/components/ui/button";
import { SCENARIOS } from "@/lib/scenarios";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default async function ConversarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Escolha um cenário</h1>
        <p className="text-muted-foreground">Sobre o que vamos conversar hoje?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {SCENARIOS.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <Card key={scenario.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {scenario.name}
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-4">
                <form action={async () => {
                  "use server";
                  await startConversation(scenario.id);
                }} className="w-full">
                  <Button className="w-full" type="submit">Iniciar</Button>
                </form>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
