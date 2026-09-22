import { Coffee, Briefcase, Plane, User } from 'lucide-react';

export const SCENARIOS = [
  {
    id: 'free',
    name: 'Conversa Livre',
    description: 'Fale sobre qualquer assunto livremente.',
    icon: User,
    systemContext: ''
  },
  {
    id: 'coffee',
    name: 'Pedir um Café',
    description: 'Treine vocabulário de cafeteria, fazendo pedidos e pagando.',
    icon: Coffee,
    systemContext: 'Você é um atendente de uma cafeteria movimentada. O usuário é um cliente. Comece perguntando o que ele vai querer.'
  },
  {
    id: 'interview',
    name: 'Entrevista de Emprego',
    description: 'Pratique respostas para entrevistas de trabalho formais.',
    icon: Briefcase,
    systemContext: 'Você é um recrutador entrevistando o usuário para uma vaga na empresa. Comece pedindo para o usuário falar sobre sua experiência profissional.'
  },
  {
    id: 'airport',
    name: 'No Aeroporto',
    description: 'Situações de imigração, check-in e despacho de bagagem.',
    icon: Plane,
    systemContext: 'Você é um agente de imigração ou atendente de check-in em um aeroporto. O usuário é o passageiro. Comece pedindo o passaporte ou bilhete.'
  }
];
