"use client";

import { useTransition, useState } from "react";
import { saveProfile } from "@/app/actions/profile";
import { ProfileValues } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveOnboardingData } from "@/app/actions/onboarding";
import { StampBadge } from "@/components/ui/stamp-badge";

export function OnboardingForm({ defaultValues }: { defaultValues?: Partial<ProfileValues> }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Partial<ProfileValues>>({
    language: "",
    level: "",
    goal: "",
    ...defaultValues
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.language || !formData.level || !formData.goal) return;
    
    startTransition(async () => {
      try {
        await saveProfile(formData as ProfileValues);
      } catch (error) {
        console.error(error);
        alert("Erro ao salvar perfil");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mt-6">
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-ink/70 tracking-wide uppercase">Idioma de Estudo</Label>
        <Select 
          value={formData.language || ""} 
          onValueChange={(val) => setFormData({ ...formData, language: val })}
        >
          <SelectTrigger className="border-0 border-b-2 border-line rounded-none bg-transparent px-0 focus:ring-0 focus:border-navy text-lg text-ink font-medium">
            <SelectValue placeholder="Selecione um idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inglês">Inglês</SelectItem>
            <SelectItem value="espanhol">Espanhol</SelectItem>
            <SelectItem value="francês">Francês</SelectItem>
            <SelectItem value="alemão">Alemão</SelectItem>
            <SelectItem value="italiano">Italiano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-ink/70 tracking-wide uppercase">Seu Nível Atual</Label>
        <Select 
          value={formData.level || ""} 
          onValueChange={(val) => setFormData({ ...formData, level: val })}
        >
          <SelectTrigger className="border-0 border-b-2 border-line rounded-none bg-transparent px-0 focus:ring-0 focus:border-navy text-lg text-ink font-medium">
            <SelectValue placeholder="Selecione seu nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A1">A1 (Iniciante)</SelectItem>
            <SelectItem value="A2">A2 (Básico)</SelectItem>
            <SelectItem value="B1">B1 (Intermediário)</SelectItem>
            <SelectItem value="B2">B2 (Intermediário Superior)</SelectItem>
            <SelectItem value="C1">C1 (Avançado)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-ink/70 tracking-wide uppercase">Principal Objetivo</Label>
        <Select 
          value={formData.goal || ""} 
          onValueChange={(val) => setFormData({ ...formData, goal: val })}
        >
          <SelectTrigger className="border-0 border-b-2 border-line rounded-none bg-transparent px-0 focus:ring-0 focus:border-navy text-lg text-ink font-medium">
            <SelectValue placeholder="Selecione um objetivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viagem">Viagem</SelectItem>
            <SelectItem value="trabalho">Trabalho</SelectItem>
            <SelectItem value="entrevista">Entrevista</SelectItem>
            <SelectItem value="conversação geral">Conversação Geral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Summary Stamp */}
      <div className="flex justify-end pt-4 min-h-32 items-center">
        {formData.language && formData.level && formData.goal && (
          <StampBadge 
            text={`${formData.language.slice(0,3)} • ${formData.level}`} 
            color="gold" 
            size="lg" 
            rotation="rotate-6"
            className="animate-in fade-in zoom-in duration-300"
          />
        )}
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="w-full text-lg h-14" 
        disabled={isPending || !formData.language || !formData.level || !formData.goal}
      >
        {isPending ? "Processando..." : "Confirmar Matrícula"}
      </Button>
    </form>
  );
}
