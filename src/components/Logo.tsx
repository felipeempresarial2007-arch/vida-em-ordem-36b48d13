import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', gap: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-base', gap: 'gap-2' },
    lg: { icon: 'w-9 h-9', text: 'text-lg', gap: 'gap-2.5' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      {/* Logo Icon - Clean, minimal */}
      <div className={cn(
        'relative flex items-center justify-center rounded-lg bg-primary',
        s.icon
      )}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-4/5 h-4/5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M7 4h10v2.5H9.5v4.5H15v2.5H9.5V20H7V4Z" 
            fill="white"
          />
        </svg>
      </div>

      {/* Text - Clean typography */}
      {showText && (
        <span className={cn('font-semibold text-foreground tracking-tight', s.text)}>
          FOCUS<span className="text-primary ml-0.5">30</span>
        </span>
      )}
    </div>
  );
}
