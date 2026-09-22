"use client";

import { useTransition, useState } from "react";
import { saveProfile } from "@/app/actions/profile";
import { ProfileValues } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Idioma de Estudo</Label>
        <Select 
          value={formData.language} 
          onValueChange={(val) => setFormData({ ...formData, language: val })}
        >
          <SelectTrigger>
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

      <div className="space-y-2">
        <Label>Seu Nível Atual</Label>
        <Select 
          value={formData.level} 
          onValueChange={(val) => setFormData({ ...formData, level: val })}
        >
          <SelectTrigger>
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

      <div className="space-y-2">
        <Label>Principal Objetivo</Label>
        <Select 
          value={formData.goal} 
          onValueChange={(val) => setFormData({ ...formData, goal: val })}
        >
          <SelectTrigger>
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

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isPending || !formData.language || !formData.level || !formData.goal}
      >
        {isPending ? "Salvando..." : "Começar a aprender"}
      </Button>
    </form>
  );
}
