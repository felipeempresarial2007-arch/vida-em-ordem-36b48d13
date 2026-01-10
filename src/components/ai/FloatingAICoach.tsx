import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AICoachChat } from './AICoachChat';

export function FloatingAICoach() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full shadow-2xl shadow-primary/30 bg-gradient-to-br from-secondary to-primary hover:scale-110 transition-transform"
            >
              <Bot className="w-6 h-6 text-white" />
            </Button>
            
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30 -z-10"
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Badge */}
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white bg-secondary rounded-full shadow-lg">
              IA
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50 w-[380px] h-[480px] lg:h-[560px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]"
          >
            <Card className="w-full h-full flex flex-col overflow-hidden border-border/50 shadow-2xl shadow-black/20">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-secondary/5 to-primary/5">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-sm">Coach de IA</h3>
                      <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-[10px] text-muted-foreground">Online</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Chat */}
              <div className="flex-1 overflow-hidden">
                <AICoachChat />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
