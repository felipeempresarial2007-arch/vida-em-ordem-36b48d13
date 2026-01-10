import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAICoach, type Message } from '@/hooks/useAICoach';
import { cn } from '@/lib/utils';

const suggestions = [
  "Como posso melhorar meu foco?",
  "Dicas para criar uma rotina produtiva",
  "Como manter a disciplina nos 30 dias?",
  "Técnicas para vencer a procrastinação",
];

// Simple markdown-like formatting for AI responses
function formatMessage(content: string) {
  // Process the content line by line for better formatting
  const lines = content.split('\n');
  
  return lines.map((line, index) => {
    let formattedLine = line;
    
    // Bold text: **text** or __text__
    formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedLine = formattedLine.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic text: *text* or _text_
    formattedLine = formattedLine.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    
    // Headers with emoji support
    if (formattedLine.startsWith('### ')) {
      formattedLine = `<span class="block text-sm font-semibold text-foreground mt-3 mb-1">${formattedLine.slice(4)}</span>`;
    } else if (formattedLine.startsWith('## ')) {
      formattedLine = `<span class="block text-base font-bold text-foreground mt-3 mb-1">${formattedLine.slice(3)}</span>`;
    } else if (formattedLine.startsWith('# ')) {
      formattedLine = `<span class="block text-lg font-bold text-foreground mt-2 mb-2">${formattedLine.slice(2)}</span>`;
    }
    
    // Numbered lists
    const numberedMatch = formattedLine.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      formattedLine = `<span class="block pl-1 my-1"><span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold mr-2">${numberedMatch[1]}</span>${numberedMatch[2]}</span>`;
    }
    
    // Bullet points
    if (formattedLine.startsWith('• ') || formattedLine.startsWith('- ')) {
      formattedLine = `<span class="block pl-2 my-0.5">→ ${formattedLine.slice(2)}</span>`;
    }
    
    // Horizontal rule
    if (formattedLine.trim() === '---' || formattedLine.trim() === '***') {
      formattedLine = '<span class="block my-2 border-t border-border/50"></span>';
    }
    
    // Empty lines = spacing
    if (formattedLine.trim() === '') {
      return '<span class="block h-2"></span>';
    }
    
    return formattedLine + ' ';
  }).join('');
}

function MessageBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1',
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'gradient-primary text-white shadow-lg shadow-primary/20'
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      {/* Message */}
      <div className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3',
        isUser 
          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
          : 'bg-muted border border-border/50 rounded-tl-sm'
      )}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <div 
            className="text-sm leading-relaxed prose-sm"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
        )}
        {!isUser && isLast && (
          <motion.span
            className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 rounded-sm align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3"
    >
      <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-muted border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function AICoachChat() {
  const { messages, isLoading, error, sendMessage, clearChat } = useAICoach();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full text-center py-8"
            >
              {/* Coach Avatar */}
              <motion.div 
                className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Bot className="w-10 h-10 text-white" />
              </motion.div>
              
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Coach de IA
                </span>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Olá! Sou seu Coach de Produtividade 👋
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Estou aqui para ajudar você a desenvolver foco, disciplina e alcançar suas metas no desafio FOCUS 30.
              </p>
              
              {/* Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((suggestion, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                    className="p-4 rounded-xl bg-muted/50 border border-border/50 text-left hover:bg-muted hover:border-primary/20 transition-all group disabled:opacity-50"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {suggestion}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {messages.map((message, i) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  isLast={i === messages.length - 1 && message.role === 'assistant' && isLoading}
                />
              ))}
              
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <TypingIndicator />
              )}
              
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mx-4 mb-2"
          >
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur">
        <form onSubmit={handleSubmit} className="flex gap-3">
          {messages.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearChat}
              disabled={isLoading}
              className="shrink-0 rounded-xl"
              title="Limpar conversa"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte algo ao seu coach..."
              disabled={isLoading}
              className="min-h-[48px] max-h-32 resize-none pr-12 rounded-xl border-border/50"
              rows={1}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 rounded-xl h-12 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Powered by Lovable AI • Respostas podem variar
        </p>
      </div>
    </div>
  );
}
