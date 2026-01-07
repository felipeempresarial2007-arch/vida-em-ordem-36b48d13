import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { 
  LayoutDashboard, 
  Home, 
  Wallet, 
  Heart, 
  Target,
  Infinity,
  LogOut, 
  Menu, 
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ambiente', label: 'Ambiente', icon: Home },
  { path: '/financas', label: 'Finanças', icon: Wallet },
  { path: '/rotina', label: 'Rotina', icon: Heart },
  { path: '/metas', label: 'Metas', icon: Target },
  { path: '/continuacao', label: 'Continuação', icon: Infinity },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col bg-card border-r border-border z-50">
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <Logo size="md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium',
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground" 
            onClick={signOut}
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-50">
        <Logo size="sm" />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-card z-40 animate-fade-in">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 text-base font-medium',
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
            <div className="pt-4 border-t border-border mt-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-muted-foreground" 
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-5 h-5" />
                Sair
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-60 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}