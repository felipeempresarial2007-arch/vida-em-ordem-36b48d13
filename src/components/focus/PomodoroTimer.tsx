import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface TimerPreset {
  label: string;
  minutes: number;
  icon: React.ReactNode;
  color: string;
}

const TIMER_PRESETS: Record<TimerMode, TimerPreset> = {
  focus: {
    label: "Foco",
    minutes: 25,
    icon: <Brain className="w-4 h-4" />,
    color: "from-primary to-accent",
  },
  shortBreak: {
    label: "Pausa Curta",
    minutes: 5,
    icon: <Coffee className="w-4 h-4" />,
    color: "from-secondary to-green-500",
  },
  longBreak: {
    label: "Pausa Longa",
    minutes: 15,
    icon: <Coffee className="w-4 h-4" />,
    color: "from-violet-500 to-purple-600",
  },
};

interface PomodoroTimerProps {
  task?: string;
  onComplete?: () => void;
}

export default function PomodoroTimer({ task, onComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  const currentPreset = TIMER_PRESETS[mode];
  const totalSeconds = currentPreset.minutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowComplete(true);
      
      // Auto-switch modes
      if (mode === "focus") {
        setCompletedPomodoros((prev) => prev + 1);
        // Every 4 pomodoros, suggest a long break
        if ((completedPomodoros + 1) % 4 === 0) {
          setTimeout(() => switchMode("longBreak"), 2000);
        } else {
          setTimeout(() => switchMode("shortBreak"), 2000);
        }
      } else {
        setTimeout(() => switchMode("focus"), 2000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, completedPomodoros]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_PRESETS[newMode].minutes * 60);
    setIsRunning(false);
    setShowComplete(false);
  }, []);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setShowComplete(false);
  };

  const resetTimer = () => {
    setTimeLeft(currentPreset.minutes * 60);
    setIsRunning(false);
    setShowComplete(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate stroke dasharray for circular progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-6"
    >
      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
        {(Object.keys(TIMER_PRESETS) as TimerMode[]).map((timerMode) => {
          const preset = TIMER_PRESETS[timerMode];
          const isActive = mode === timerMode;
          
          return (
            <button
              key={timerMode}
              onClick={() => !isRunning && switchMode(timerMode)}
              disabled={isRunning}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                isActive
                  ? `bg-gradient-to-r ${preset.color} text-white shadow-md`
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                isRunning && !isActive && "opacity-50 cursor-not-allowed"
              )}
            >
              {preset.icon}
              <span className="hidden sm:inline">{preset.label}</span>
              <span className="sm:hidden">{preset.minutes}m</span>
            </button>
          );
        })}
      </div>

      {/* Completed Pomodoros */}
      {completedPomodoros > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span>Pomodoros completados:</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(completedPomodoros, 8) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-accent"
              />
            ))}
            {completedPomodoros > 8 && (
              <span className="text-xs text-primary font-medium">+{completedPomodoros - 8}</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Timer Circle */}
      <div className="relative">
        <svg width="280" height="280" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-green-500 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <span className="text-lg font-semibold text-secondary">
                  {mode === "focus" ? "Foco completo!" : "Pausa encerrada!"}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <span className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-muted-foreground mt-2 capitalize">
                  {currentPreset.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pulsing ring when running */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Task reminder */}
      {task && mode === "focus" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xs text-center"
        >
          <p className="text-xs text-muted-foreground mb-1">Tarefa atual:</p>
          <p className="text-sm font-medium text-foreground/80 italic">"{task}"</p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="w-12 h-12 rounded-full border-muted-foreground/20"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          onClick={toggleTimer}
          className={cn(
            "w-16 h-16 rounded-full shadow-lg transition-all",
            `bg-gradient-to-br ${currentPreset.color}`,
            isRunning && "shadow-primary/30"
          )}
        >
          {isRunning ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </Button>

        <div className="w-12 h-12" /> {/* Spacer for symmetry */}
      </div>

      {/* Tips */}
      <AnimatePresence>
        {!isRunning && timeLeft === totalSeconds && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground text-center max-w-xs"
          >
            {mode === "focus"
              ? "Pressione play para iniciar 25 minutos de foco profundo"
              : "Use este tempo para descansar sua mente"}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
