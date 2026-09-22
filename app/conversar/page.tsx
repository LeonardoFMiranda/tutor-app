import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { startConversation } from "@/app/actions/conversation";
import { Button } from "@/components/ui/button";
import { SCENARIOS } from "@/lib/scenarios";
import { TicketCard } from "@/components/ui/ticket-card";
import { StampBadge } from "@/components/ui/stamp-badge";

export default async function ConversarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="mb-12 notebook-margin pl-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-semibold mb-3 text-ink">Destinos Disponíveis</h1>
        <p className="text-ink/70 font-medium">Selecione o cenário que deseja simular. Cada carimbo representa uma nova oportunidade de prática.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {SCENARIOS.map((scenario) => {
          const Icon = scenario.icon;
          const isLivre = scenario.id === "livre";
          
          return (
            <TicketCard key={scenario.id} isSpecial={isLivre} className="group">
              <div className="flex justify-between items-start mb-4">
                <div className="pr-4">
                  <h3 className="font-heading font-semibold text-2xl text-ink mb-2">
                    {scenario.name}
                  </h3>
                  <p className="text-ink/80 text-sm leading-relaxed min-h-[3rem]">
                    {scenario.description}
                  </p>
                </div>
                {!isLivre && (
                  <StampBadge 
                    icon={Icon} 
                    color="navy" 
                    size="sm" 
                    rotation="rotate-12"
                    className="shrink-0 transition-transform group-hover:-rotate-3"
                  />
                )}
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="font-special text-ink/50 text-xs uppercase tracking-widest">
                  ID: {scenario.id.substring(0,6)}
                </div>
                <form action={async () => {
                  "use server";
                  await startConversation(scenario.id);
                }}>
                  <Button variant="default" size="sm" type="submit" className="font-semibold px-6">
                    Embarcar
                  </Button>
                </form>
              </div>
            </TicketCard>
          );
        })}
      </div>
    </div>
  );
}
