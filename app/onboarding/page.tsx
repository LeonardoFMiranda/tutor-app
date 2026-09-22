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
    <div className="container max-w-lg mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Tutor de Idiomas</CardTitle>
          <CardDescription>
            Conte-nos um pouco sobre seus objetivos para personalizarmos suas conversas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm defaultValues={profile || undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
