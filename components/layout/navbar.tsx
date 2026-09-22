import { UserButton, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="font-bold text-lg">
          Tutor de Idiomas
        </Link>
        <div className="flex items-center gap-4">
          {userId ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
              <Link href="/conversar" className="text-sm font-medium hover:underline">
                Conversar
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm font-medium hover:underline">
                Entrar
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
