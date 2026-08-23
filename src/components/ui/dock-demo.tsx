import {
  Activity,
  Component,
  HomeIcon,
  Mail,
  Package,
  ScrollText,
  SunMoon,
} from 'lucide-react';

import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';

const data = [
  { title: 'Home', icon: HomeIcon, href: '#' },
  { title: 'Products', icon: Package, href: '#' },
  { title: 'Components', icon: Component, href: '#' },
  { title: 'Activity', icon: Activity, href: '#' },
  { title: 'Change Log', icon: ScrollText, href: '#' },
  { title: 'Email', icon: Mail, href: '#' },
  { title: 'Theme', icon: SunMoon, href: '#' },
];

export function AppleStyleDock() {
  return (
    <div className="absolute bottom-2 left-1/2 max-w-full -translate-x-1/2">
      <Dock className="items-end pb-3">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <DockItem
              key={item.title}
              className="aspect-square rounded-full bg-muted"
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>
                <Icon className="h-full w-full text-foreground" />
              </DockIcon>
            </DockItem>
          );
        })}
      </Dock>
    </div>
  );
}
