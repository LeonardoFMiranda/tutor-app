import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <div className="notebook-margin pl-8 border-l border-line/30 bg-paper py-8 px-6 shadow-sm">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-heading text-4xl font-semibold text-ink">Ficha de Matrícula</h1>
            <p className="text-ink/70 mt-2 font-medium">
              Conte-nos seus objetivos para personalizarmos o seu material didático.
            </p>
          </div>
          <div className="font-special text-red font-bold text-lg rotate-2 border border-red px-2 py-1">
            N.º 0184
          </div>
        </div>

        <OnboardingForm defaultValues={profile || undefined} />

      </div>
    </div>
  );
}
