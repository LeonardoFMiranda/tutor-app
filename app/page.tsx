import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-primary mb-6">
        Fluência ao seu alcance
      </h1>
      <p className="max-w-2xl text-xl text-muted-foreground mb-10">
        Pratique conversação no seu ritmo. Nosso tutor com Inteligência Artificial corrige seus erros, explica as regras em tempo real e adapta-se ao seu nível.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">Começar a Praticar</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/onboarding">Como funciona</Link>
        </Button>
      </div>
      
      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl text-left">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Múltiplos Idiomas</h3>
          <p className="text-muted-foreground">Inglês, Espanhol, Francês, Alemão e Italiano. Aprenda conversando naturalmente.</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Correção em Tempo Real</h3>
          <p className="text-muted-foreground">Saiba o que errou imediatamente com correções gramaticais e de vocabulário detalhadas.</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Cenários Práticos</h3>
          <p className="text-muted-foreground">Simule viagens, entrevistas de emprego ou pedir um café. Prepare-se para a vida real.</p>
        </div>
      </div>
    </div>
  );
}
