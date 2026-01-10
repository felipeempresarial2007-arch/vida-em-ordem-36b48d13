import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Brain, Wind, Target, Zap, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Phase = "intro" | "breathing" | "task" | "visualization" | "countdown" | "execute" | "silence";

interface Message {
  text: string;
  delay?: number;
  waitForNext?: boolean;
  requiresInput?: boolean;
}

const FocusProtocol = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [breathingStep, setBreathingStep] = useState(0);
  const [breathingCycle, setBreathingCycle] = useState(1);
  const [task, setTask] = useState("");
  const [taskSubmitted, setTaskSubmitted] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [showContinue, setShowContinue] = useState(false);

  const addMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, text]);
  }, []);

  // Phase 1: Introduction
  useEffect(() => {
    if (phase === "intro") {
      const introMessages = [
        "Iniciando Protocolo de Estado de Foco.",
        "As distrações externas perdem a força agora.",
        "Sua atenção se volta para dentro.",
        "Sente-se com a coluna ereta, ombros relaxados, pés firmes no chão.",
        "Esta é a sua postura de performance."
      ];

      let index = 0;
      const showNext = () => {
        if (index < introMessages.length) {
          addMessage(introMessages[index]);
          index++;
          setTimeout(showNext, 2500);
        } else {
          setTimeout(() => {
            setShowContinue(true);
          }, 1000);
        }
      };
      showNext();
    }
  }, [phase, addMessage]);

  const startBreathing = () => {
    setShowContinue(false);
    setPhase("breathing");
    setIsBreathing(true);
    addMessage("Agora, vamos regular sua respiração.");
  };

  // Phase 1: Breathing exercises
  useEffect(() => {
    if (phase === "breathing" && isBreathing) {
      const breathingSequence = async () => {
        for (let cycle = 1; cycle <= 3; cycle++) {
          setBreathingCycle(cycle);
          
          // Inhale
          setBreathPhase("inhale");
          addMessage(`Ciclo ${cycle}/3: Respire fundo pelo nariz por 4 segundos...`);
          await new Promise(r => setTimeout(r, 4000));
          
          // Hold
          setBreathPhase("hold");
          addMessage("Segure o ar por 4 segundos...");
          await new Promise(r => setTimeout(r, 4000));
          
          // Exhale
          setBreathPhase("exhale");
          addMessage("Expire lentamente pela boca por 6 segundos, liberando toda a tensão...");
          await new Promise(r => setTimeout(r, 6000));
          
          if (cycle < 3) {
            await new Promise(r => setTimeout(r, 1000));
          }
        }
        
        setIsBreathing(false);
        await new Promise(r => setTimeout(r, 1500));
        addMessage("Seu sistema nervoso está se acalmando.");
        await new Promise(r => setTimeout(r, 2000));
        addMessage("O ruído mental diminui. Você está no controle.");
        await new Promise(r => setTimeout(r, 2500));
        setPhase("task");
      };
      
      breathingSequence();
    }
  }, [phase, isBreathing, addMessage]);

  // Phase 2: Task definition
  useEffect(() => {
    if (phase === "task" && !taskSubmitted) {
      setTimeout(() => {
        addMessage("Qual é a sua única e exclusiva tarefa para esta sessão?");
      }, 1000);
    }
  }, [phase, taskSubmitted, addMessage]);

  const handleTaskSubmit = async () => {
    if (!task.trim()) return;
    
    setTaskSubmitted(true);
    addMessage(`Sua tarefa: "${task}"`);
    
    await new Promise(r => setTimeout(r, 2000));
    setPhase("visualization");
  };

  // Phase 2: Visualization
  useEffect(() => {
    if (phase === "visualization") {
      const visualizationSequence = async () => {
        addMessage("Feche os olhos por um momento.");
        await new Promise(r => setTimeout(r, 2500));
        addMessage("Visualize o primeiro passo concreto para iniciar essa tarefa.");
        await new Promise(r => setTimeout(r, 3000));
        addMessage("Veja apenas isso. Nada mais existe.");
        await new Promise(r => setTimeout(r, 3000));
        addMessage("Toda a sua energia mental agora flui para este único ponto.");
        await new Promise(r => setTimeout(r, 2500));
        addMessage("Outras tarefas, preocupações e ideias estão do lado de fora deste túnel de foco.");
        await new Promise(r => setTimeout(r, 2500));
        addMessage("Elas podem esperar.");
        await new Promise(r => setTimeout(r, 2500));
        addMessage("Sua mente está clara. Sua tarefa está definida.");
        await new Promise(r => setTimeout(r, 2000));
        addMessage("Você está pronto para executar com precisão.");
        await new Promise(r => setTimeout(r, 2500));
        setPhase("countdown");
      };
      
      visualizationSequence();
    }
  }, [phase, addMessage]);

  // Phase 3: Countdown
  useEffect(() => {
    if (phase === "countdown") {
      const countdownSequence = async () => {
        addMessage("Vou fazer uma contagem regressiva de 3 até 1.");
        await new Promise(r => setTimeout(r, 2500));
        
        setCountdownNumber(3);
        addMessage("Em 3, sua atenção está totalmente na tarefa.");
        await new Promise(r => setTimeout(r, 2500));
        
        setCountdownNumber(2);
        addMessage("Em 2, você sente uma prontidão para agir, sem hesitação.");
        await new Promise(r => setTimeout(r, 2500));
        
        setCountdownNumber(1);
        addMessage("Em 1, você irá iniciar a tarefa imediatamente.");
        await new Promise(r => setTimeout(r, 2500));
        
        setPhase("execute");
      };
      
      countdownSequence();
    }
  }, [phase, addMessage]);

  // Phase 3: Execute
  useEffect(() => {
    if (phase === "execute") {
      const executeSequence = async () => {
        addMessage("EXECUTE.");
        await new Promise(r => setTimeout(r, 3000));
        addMessage("Mantenha este estado.");
        await new Promise(r => setTimeout(r, 2000));
        addMessage("Se a distração surgir, apenas retorne sua atenção à respiração e à tarefa.");
        await new Promise(r => setTimeout(r, 2500));
        addMessage("Eu estarei em silêncio agora. Bom trabalho.");
        await new Promise(r => setTimeout(r, 2000));
        setPhase("silence");
      };
      
      executeSequence();
    }
  }, [phase, addMessage]);

  const getPhaseIcon = () => {
    switch (phase) {
      case "intro": return <Brain className="w-8 h-8" />;
      case "breathing": return <Wind className="w-8 h-8" />;
      case "task":
      case "visualization": return <Target className="w-8 h-8" />;
      case "countdown":
      case "execute": return <Zap className="w-8 h-8" />;
      case "silence": return <VolumeX className="w-8 h-8" />;
      default: return <Brain className="w-8 h-8" />;
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "intro": return "Transição";
      case "breathing": return "Ancoragem";
      case "task": return "Definição";
      case "visualization": return "Visualização";
      case "countdown": return "Ativação";
      case "execute": return "Execução";
      case "silence": return "Estado de Fluxo";
      default: return "";
    }
  };

  const getBreathingCircleScale = () => {
    if (!isBreathing) return 1;
    switch (breathPhase) {
      case "inhale": return 1.5;
      case "hold": return 1.5;
      case "exhale": return 1;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2 text-primary">
          {getPhaseIcon()}
          <span className="text-sm font-medium">{getPhaseLabel()}</span>
        </div>
        
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Breathing visualization */}
      <AnimatePresence>
        {isBreathing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <motion.div
              animate={{ scale: getBreathingCircleScale() }}
              transition={{ duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 0.3 : 6 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/20"
            >
              <motion.div
                animate={{ scale: getBreathingCircleScale() * 0.6 }}
                transition={{ duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 0.3 : 6 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center"
              >
                <span className="text-xs font-medium text-primary-foreground capitalize">
                  {breathPhase === "inhale" ? "Inspire" : breathPhase === "hold" ? "Segure" : "Expire"}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown visualization */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center py-8"
          >
            <motion.div
              key={countdownNumber}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <span className="text-4xl font-bold text-primary-foreground">{countdownNumber}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execute flash */}
      <AnimatePresence>
        {phase === "execute" && messages[messages.length - 1] === "EXECUTE." && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, times: [0, 0.5, 1] }}
            className="fixed inset-0 bg-primary/20 pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${
                message === "EXECUTE." 
                  ? "text-2xl font-bold text-primary text-center py-4" 
                  : message.startsWith("Sua tarefa:")
                  ? "text-muted-foreground italic text-center"
                  : "text-foreground/90"
              }`}
            >
              {message}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Continue button after intro */}
        <AnimatePresence>
          {showContinue && phase === "intro" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6"
            >
              <Button
                onClick={startBreathing}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                <Wind className="w-4 h-4 mr-2" />
                Iniciar Exercício de Respiração
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task input */}
        <AnimatePresence>
          {phase === "task" && !taskSubmitted && messages.some(m => m.includes("única e exclusiva")) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 space-y-3"
            >
              <Input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Digite sua tarefa aqui..."
                className="bg-card/50 border-primary/20 focus:border-primary"
                onKeyDown={(e) => e.key === "Enter" && handleTaskSubmit()}
              />
              <Button
                onClick={handleTaskSubmit}
                disabled={!task.trim()}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                <Target className="w-4 h-4 mr-2" />
                Definir Tarefa
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Silence state */}
        <AnimatePresence>
          {phase === "silence" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="pt-8 text-center space-y-6"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              >
                <VolumeX className="w-8 h-8 text-primary/60" />
              </motion.div>
              
              <p className="text-muted-foreground text-sm">
                Modo silêncio ativo. Foque na sua tarefa.
              </p>
              
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-primary/20 text-primary hover:bg-primary/10"
              >
                Voltar ao Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <div className="p-4">
        <div className="flex justify-center gap-2">
          {["intro", "breathing", "task", "visualization", "countdown", "execute", "silence"].map((p, i) => (
            <motion.div
              key={p}
              className={`w-2 h-2 rounded-full ${
                phase === p 
                  ? "bg-primary" 
                  : ["intro", "breathing", "task", "visualization", "countdown", "execute", "silence"].indexOf(phase) > i
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
              animate={phase === p ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusProtocol;
