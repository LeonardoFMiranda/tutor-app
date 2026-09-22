import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RedPenCorrection } from "@/components/ui/red-pen-correction";
import { StampBadge } from "@/components/ui/stamp-badge";
import { LanguagesIcon, MessageSquareIcon, CompassIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16">
      
      <div className="max-w-4xl w-full mx-auto relative notebook-margin py-8">
        
        <h1 className="text-5xl md:text-6xl font-heading font-semibold text-ink leading-tight mb-8">
          A fluência não vem da perfeição,<br/>
          mas da <i className="text-navy">prática</i> constante.
        </h1>
        
        <p className="max-w-2xl text-xl text-ink/80 mb-12 font-medium">
          Converse no seu ritmo. Nosso tutor 
          <RedPenCorrection original=" are " correction=" is " className="mx-2" />
          com Inteligência Artificial corrige seus erros, explica as regras em tempo real e adapta-se ao seu nível.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 z-10 items-start">
          <Link href="/conversar">
            <Button size="lg" className="h-12 px-8 text-base font-semibold">
              Começar a Praticar
            </Button>
          </Link>
          <Link href="/dashboard" className="h-12 px-4 flex items-center justify-center">
            <span className="font-semibold text-navy underline underline-offset-4 hover:text-navy/80">Ver meu Progresso</span>
          </Link>
        </div>

      </div>

      <div className="mt-24 grid grid-cols-1 gap-12 sm:grid-cols-3 max-w-5xl mx-auto text-left relative pt-12 border-t border-line border-dashed">
        <div className="flex flex-col gap-4 relative">
          <StampBadge icon={LanguagesIcon} color="navy" size="sm" className="absolute -top-12 -left-2" />
          <h3 className="font-heading font-semibold text-2xl text-ink">Idiomas pelo Mundo</h3>
          <p className="text-ink/70">Inglês, Espanhol, Francês, Alemão e Italiano. Aprenda conversando naturalmente.</p>
        </div>
        <div className="flex flex-col gap-4 relative">
          <StampBadge icon={MessageSquareIcon} color="red" size="sm" rotation="rotate-6" className="absolute -top-12 -left-2" />
          <h3 className="font-heading font-semibold text-2xl text-ink">Correção em Tempo Real</h3>
          <p className="text-ink/70">Saiba o que errou imediatamente com anotações claras sobre sua gramática e vocabulário.</p>
        </div>
        <div className="flex flex-col gap-4 relative">
          <StampBadge icon={CompassIcon} color="gold" size="sm" className="absolute -top-12 -left-2" />
          <h3 className="font-heading font-semibold text-2xl text-ink">Cenários Práticos</h3>
          <p className="text-ink/70">Simule viagens, entrevistas de emprego ou pedir um café. Prepare-se para a vida real.</p>
        </div>
      </div>
    </div>
  );
}
