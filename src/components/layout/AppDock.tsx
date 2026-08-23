import { useNavigate, useLocation } from 'react-router-dom';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface AppDockItem {
  path: string;
  label: string;
  icon: LucideIcon;
  aliases?: string[];
}

interface AppDockProps {
  items: AppDockItem[];
  className?: string;
}

export function AppDock({ items, className }: AppDockProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Dock
      className={cn('items-end pb-3 shadow-xl shadow-foreground/5', className)}
      magnification={64}
      distance={110}
      panelHeight={60}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          location.pathname === item.path ||
          (item.aliases?.includes(location.pathname) ?? false);

        return (
          <DockItem
            key={item.path}
            className={cn(
              'aspect-square cursor-pointer rounded-full transition-colors',
              isActive ? 'bg-primary/15' : 'bg-muted/60'
            )}
          >
            <DockLabel>{item.label}</DockLabel>
            <DockIcon>
              <button
                type="button"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(item.path)}
                className="flex h-full w-full items-center justify-center"
              >
                <Icon
                  className={cn(
                    'h-full w-full transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
              </button>
            </DockIcon>
          </DockItem>
        );
      })}
    </Dock>
  );
}
