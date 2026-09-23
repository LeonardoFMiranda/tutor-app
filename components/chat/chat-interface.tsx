"use client";

import { useChat, Message } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useTransition, useState } from 'react';
import { isRedirectError } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { generateConversationSummary } from '@/app/actions/summary';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function HighlightedUserMessage({ text, corrections }: { text: string; corrections?: any[] }) {
  if (!corrections || corrections.length === 0) return <>{text}</>;

  let elements: React.ReactNode[] = [text];

  corrections.forEach((corr, index) => {
    elements = elements.flatMap((el, elIndex) => {
      if (typeof el === 'string') {
        const parts = el.split(corr.originalText);
        if (parts.length === 1) return [el];
        
        const newEls: React.ReactNode[] = [];
        parts.forEach((part, i) => {
          newEls.push(part);
          if (i < parts.length - 1) {
            newEls.push(
              <Popover key={`corr-${index}-${elIndex}-${i}`}>
                <PopoverTrigger 
                  render={<span className="bg-destructive/30 text-red-100 border-b-2 border-destructive cursor-pointer hover:bg-destructive/50 px-1 rounded-sm" />}
                >
                  {corr.originalText}
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" side="bottom">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between items-center">
                      <Badge variant="destructive">{corr.category}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Correção: </span>
                      <span className="font-semibold text-primary">{corr.correctedText}</span>
                    </div>
                    <p className="text-sm">{corr.explanation}</p>
                  </div>
                </PopoverContent>
              </Popover>
            );
          }
        });
        return newEls;
      }
      return [el];
    });
  });

  return <>{elements}</>;
}

const getMessageText = (m: any) => {
  if (m.content) return m.content;
  if (m.parts) {
    return m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');
  }
  return '';
};

export function ChatInterface({ conversationId, initialMessages = [] }: { conversationId: string, initialMessages?: Message[] }) {
  const { messages, sendMessage, status, error } = useChat({
    api: '/api/chat',
    body: {
      conversationId,
    },
    initialMessages,
  });

  const [localInput, setLocalInput] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || status !== 'ready') return;
    sendMessage({ text: localInput }, { body: { conversationId } });
    setLocalInput('');
  };

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleEndConversation = () => {
    startTransition(async () => {
      try {
        await generateConversationSummary(conversationId);
      } catch (err) {
        if (isRedirectError(err)) {
          throw err;
        }
        console.error(err);
        alert("Erro ao gerar resumo.");
      }
    });
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-semibold text-muted-foreground">Sessão Ativa</h2>
        <Button variant="destructive" onClick={handleEndConversation} disabled={isPending || messages.length === 0}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Encerrar Conversa
        </Button>
      </div>
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-10">
              Mande uma mensagem para começar a conversar!
            </div>
          )}
          {messages.map((m, index) => {
            let userCorrections = undefined;
            if (m.role === 'user') {
              const nextMsg = messages[index + 1];
              if (nextMsg?.role === 'assistant' && nextMsg.toolInvocations) {
                const correctionTool = nextMsg.toolInvocations.find(t => t.toolName === 'reportCorrections');
                if (correctionTool && 'args' in correctionTool && correctionTool.args.corrections) {
                  userCorrections = correctionTool.args.corrections;
                }
              }
            }

            const messageText = getMessageText(m);

            const isLastMessage = index === messages.length - 1;
            
            // Se a mensagem do assistente for vazia
            if (m.role === 'assistant' && !messageText.trim()) {
              if (isLastMessage && status !== 'ready') {
                return (
                  <div key={m.id} className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Digitando...</span>
                    </div>
                  </div>
                );
              }
              return null; // Ocultar bolha vazia
            }

            return (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted whitespace-pre-wrap'}`}>
                  {m.role === 'user' ? (
                    <HighlightedUserMessage text={messageText} corrections={userCorrections} />
                  ) : (
                    <div className="prose prose-sm max-w-none text-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {messageText}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {status !== 'ready' && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Digitando...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </CardContent>
        <div className="p-4 border-t">
          {error && (
            <div className="text-center text-sm text-destructive mb-4 p-2 bg-destructive/10 rounded-md">
              Ocorreu um erro: {error.message}
            </div>
          )}
          <form onSubmit={onSubmit} className="flex w-full space-x-2">
            <Input
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Escreva sua mensagem..."
              disabled={status !== 'ready'}
              className="flex-1"
              autoComplete="off"
            />
            <Button type="submit" disabled={status !== 'ready' || !localInput.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-muted-foreground">
              Correções e respostas geradas por IA podem conter imprecisões.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
