import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Página não encontrada</h2>
      <p className="text-muted-foreground mb-8">
        Ops! A página que você está procurando não existe ou foi movida.
      </p>
      <Button asChild size="lg">
        <Link href="/">Voltar para o Início</Link>
      </Button>
    </div>
  );
}
