# Tutor de Idiomas AI (MVP)

Um MVP completo para aprender e praticar novos idiomas através de simulações com IA. Construído com a stack moderna (Next.js 15, Vercel AI SDK, Supabase e Clerk).

## 💡 O Problema
Aprender um novo idioma frequentemente trava na etapa da **prática real**. Os aplicativos de idiomas focam em repetição espaçada e traduções isoladas, mas muitos alunos "congelam" quando precisam pedir um café ou falar de suas experiências numa entrevista de emprego, por falta de prática num ambiente seguro e sem julgamentos.

## 🛠️ A Solução
O Tutor de Idiomas AI é uma aplicação imersiva onde o usuário pode entrar em um "Cenário" (ex: Aeroporto, Cafeteria) e conversar naturalmente no idioma alvo.
A grande sacada: em tempo real, enquanto a IA devolve a resposta para manter a conversa fluindo, ela também aciona ferramentas internas para **analisar e classificar erros gramaticais** cometidos pelo aluno, destacando as correções diretamente na tela.
No final, a conversa é encerrada gerando um **Resumo** com os principais pontos e o vocabulário novo.

## 🚀 Tech Stack e Decisões
- **Next.js 15 (App Router)**: Escolhido por ser o padrão de mercado para apps React, fornecendo SSR e Server Actions.
- **Vercel AI SDK**: Crucial para orquestrar LLMs (Llama-3 via Groq) usando `streamText` e extrações estruturadas via `generateObject`.
- **Groq API**: Fornece acesso ultra-rápido aos modelos Llama-3.1, tornando o chat em tempo real e de baixíssimo custo.
- **Clerk**: Para um fluxo de autenticação e gestão de usuários eficiente e integrado.
- **Supabase (PostgreSQL)**: Persistência de conversas, mensagens e resumos usando Prisma ORM.
- **Tailwind CSS + shadcn/ui**: Criação veloz e consistente de componentes UI (Tooltips, Popovers, Cards, Badges).
- **Recharts**: Gráficos no dashboard.

## ⚙️ Funcionalidades Implementadas (MVP)
1. **Onboarding**: O usuário escolhe qual idioma quer aprender e o seu nível atual (Iniciante, Intermediário, Avançado).
2. **Cenários Guiados**: A IA toma a iniciativa iniciando o cenário escolhido no idioma alvo.
3. **Correção Automática**: O LLM gera a resposta textual e extrai a correção simultaneamente. O frontend mapeia os erros na mensagem do aluno e exibe popovers flutuantes explicando o motivo da falha.
4. **Dashboard de Progressão**: Gráficos exibindo a evolução da quantidade de erros por conversa e as palavras mais repetidas (Banco de Erros).
5. **Geração de Resumo**: Ao finalizar o cenário, o sistema gera uma lista de vocabulário e os pontos principais praticados.

## 📦 Como rodar localmente

Clone este repositório e crie o `.env`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

DATABASE_URL=...

GROQ_API_KEY=...

# (Opcional) Upstash para Rate Limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Em seguida, instale as dependências e rode o projeto:
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Acesse em `http://localhost:3000`.
