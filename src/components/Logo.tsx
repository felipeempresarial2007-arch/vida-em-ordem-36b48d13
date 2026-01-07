import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { 
      icon: 'w-9 h-9', 
      text: 'text-base', 
      gap: 'gap-2.5',
      accent: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5'
    },
    md: { 
      icon: 'w-11 h-11', 
      text: 'text-lg', 
      gap: 'gap-3',
      accent: 'w-3 h-3 -bottom-0.5 -right-0.5'
    },
    lg: { 
      icon: 'w-14 h-14', 
      text: 'text-xl', 
      gap: 'gap-3.5',
      accent: 'w-3.5 h-3.5 -bottom-1 -right-1'
    },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      {/* Logo Icon - Design profissional minimalista */}
      <div className={cn(
        'relative flex items-center justify-center rounded-2xl shadow-lg',
        s.icon
      )}
      style={{
        background: 'linear-gradient(145deg, hsl(24 68% 70%) 0%, hsl(22 65% 62%) 100%)'
      }}
      >
        {/* F estilizado - tipografia geométrica moderna */}
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          className="w-3/4 h-3/4"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Barra vertical do F */}
          <rect 
            x="9" 
            y="6" 
            width="4.5" 
            height="20" 
            rx="1.5" 
            fill="white"
          />
          {/* Barra horizontal superior do F */}
          <rect 
            x="9" 
            y="6" 
            width="14" 
            height="4" 
            rx="1.5" 
            fill="white"
          />
          {/* Barra horizontal do meio do F */}
          <rect 
            x="9" 
            y="13" 
            width="10" 
            height="3.5" 
            rx="1.25" 
            fill="white"
          />
        </svg>
        
        {/* Círculo accent - representa foco/objetivo */}
        <div className={cn(
          'absolute rounded-full border-2 border-white shadow-sm',
          s.accent
        )}
        style={{
          background: 'linear-gradient(135deg, hsl(152 45% 60%) 0%, hsl(152 40% 52%) 100%)'
        }}
        />
      </div>

      {/* Tipografia - moderna e equilibrada */}
      {showText && (
        <div className="flex items-baseline gap-1.5">
          <span className={cn('font-bold text-foreground tracking-tight', s.text)}>
            FOCUS
          </span>
          <span className={cn('font-bold text-primary tracking-tight', s.text)}>
            30
          </span>
        </div>
      )}
    </div>
  );
}