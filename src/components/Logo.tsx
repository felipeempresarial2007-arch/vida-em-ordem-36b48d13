import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-base', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-lg', gap: 'gap-2.5' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', gap: 'gap-3' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      {/* Logo Icon */}
      <div className={cn(
        'relative flex items-center justify-center rounded-xl gradient-primary shadow-md',
        s.icon
      )}>
        {/* F shape */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-5/6 h-5/6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M7 4h10v2.5H9.5v4.5H15v2.5H9.5V20H7V4Z" 
            fill="white"
          />
        </svg>
        {/* Circle accent */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn('font-bold text-foreground tracking-tight', s.text)}>
            FOCUS <span className="text-primary">30</span>
          </span>
        </div>
      )}
    </div>
  );
}