import { motion } from 'framer-motion';
import { Bot, Zap, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AICoachChat } from '@/components/ai/AICoachChat';

export default function AICoach() {
  return (
    <motion.div 
      className="h-[calc(100vh-8rem)] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <div className="flex items-center gap-3 flex-1">
          <motion.div 
            className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground">Coach de IA</h1>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[10px] font-medium text-secondary">Online</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Seu mentor de produtividade e foco
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">FOCUS 30</span>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 overflow-hidden border-border/50 flex flex-col">
        <AICoachChat />
      </Card>
    </motion.div>
  );
}
