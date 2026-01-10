import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'symbol' | 'wordmark';
  colorMode?: 'color' | 'mono' | 'mono-dark';
  className?: string;
}

export default function Logo({ 
  size = 'md', 
  variant = 'full',
  colorMode = 'color',
  className 
}: LogoProps) {
  const sizes = {
    xs: { symbol: 24, text: 'text-xs', gap: 'gap-1.5' },
    sm: { symbol: 28, text: 'text-sm', gap: 'gap-2' },
    md: { symbol: 32, text: 'text-base', gap: 'gap-2' },
    lg: { symbol: 40, text: 'text-lg', gap: 'gap-2.5' },
    xl: { symbol: 48, text: 'text-xl', gap: 'gap-3' },
  };

  const s = sizes[size];

  // Color definitions based on mode
  const colors = {
    color: {
      primary: 'hsl(24, 75%, 50%)',      // Sophisticated orange
      secondary: 'hsl(24, 65%, 42%)',    // Darker orange for depth
      text: 'currentColor',
      accent: 'hsl(24, 75%, 50%)',
    },
    mono: {
      primary: 'hsl(0, 0%, 15%)',
      secondary: 'hsl(0, 0%, 25%)',
      text: 'hsl(0, 0%, 15%)',
      accent: 'hsl(0, 0%, 15%)',
    },
    'mono-dark': {
      primary: 'hsl(0, 0%, 100%)',
      secondary: 'hsl(0, 0%, 90%)',
      text: 'hsl(0, 0%, 100%)',
      accent: 'hsl(0, 0%, 100%)',
    },
  };

  const c = colors[colorMode];

  // Symbol: Abstract focal point with progressive arc
  // Concept: A circle segment (representing 30-day journey) with a focal point
  // The wedge creates visual tension pointing forward, suggesting focus and direction
  const Symbol = () => (
    <svg 
      width={s.symbol} 
      height={s.symbol} 
      viewBox="0 0 48 48" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Main circle arc - represents the 30-day journey */}
      <circle 
        cx="24" 
        cy="24" 
        r="20" 
        stroke={c.primary}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="100 26"
        strokeDashoffset="25"
      />
      
      {/* Inner focal point - the center of attention */}
      <circle 
        cx="24" 
        cy="24" 
        r="6" 
        fill={c.primary}
      />
      
      {/* Subtle direction indicator - pointing forward */}
      <path
        d="M34 24L40 24"
        stroke={c.secondary}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );

  // Wordmark with refined typography
  const Wordmark = () => (
    <div className={cn('flex items-baseline', s.text)}>
      <span 
        className="font-semibold tracking-tight"
        style={{ color: c.text }}
      >
        FOCUS
      </span>
      <span 
        className="font-semibold ml-1"
        style={{ color: c.accent }}
      >
        30
      </span>
    </div>
  );

  if (variant === 'symbol') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Symbol />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center', className)}>
        <Wordmark />
      </div>
    );
  }

  // Full logo: Symbol + Wordmark
  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <Symbol />
      <Wordmark />
    </div>
  );
}