"use client";

import { useChat, Message } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { generateConversationSummary } from '@/app/actions/summary';

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
                <PopoverTrigger asChild>
                  <span className="bg-destructive/30 text-red-100 border-b-2 border-destructive cursor-pointer hover:bg-destructive/50 px-1 rounded-sm">
                    {corr.originalText}
                  </span>
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

export function ChatInterface({ conversationId, initialMessages = [] }: { conversationId: string, initialMessages?: Message[] }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      conversationId,
    },
    initialMessages,
  });

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleEndConversation = () => {
    startTransition(async () => {
      try {
        await generateConversationSummary(conversationId);
      } catch (err) {
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

            // Se for chamada de tool isolada sem texto ainda, não queremos renderizar bolha vazia se content for ""
            if (m.role === 'assistant' && m.content.trim() === '' && m.toolInvocations) {
              return null; 
            }

            return (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted whitespace-pre-wrap'}`}>
                  {m.role === 'user' ? (
                    <HighlightedUserMessage text={m.content} corrections={userCorrections} />
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
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
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
