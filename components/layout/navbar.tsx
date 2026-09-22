import { UserButton, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { StampBadge } from "@/components/ui/stamp-badge";

export async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="border-b border-line bg-paper">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <StampBadge text="TI" color="navy" size="sm" rotation="-rotate-6" className="group-hover:rotate-0 transition-transform" />
          <span className="font-heading font-semibold text-xl tracking-tight text-ink">
            Tutor de Idiomas
          </span>
        </Link>
        <div className="flex items-center gap-6">
          {userId ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-navy hover:underline underline-offset-4 transition-colors">
                Progresso
              </Link>
              <Link href="/conversar" className="text-sm font-medium hover:text-navy hover:underline underline-offset-4 transition-colors">
                Praticar
              </Link>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full ring-2 ring-navy/20",
                  }
                }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm font-medium hover:text-navy hover:underline underline-offset-4 transition-colors">
                Entrar / Matricular-se
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
