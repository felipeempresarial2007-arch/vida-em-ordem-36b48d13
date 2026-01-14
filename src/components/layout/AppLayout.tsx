import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { FloatingAICoach } from '@/components/ai/FloatingAICoach';
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
  Settings,
  Download,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/ambiente', label: 'Ambiente', icon: Home },
  { path: '/financas', label: 'Finanças', icon: Wallet },
  { path: '/rotina', label: 'Rotina', icon: Heart },
  { path: '/metas', label: 'Metas', icon: Target },
  { path: '/continuacao', label: 'Continuar', icon: Infinity },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col bg-card border-r border-border">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <Logo size="md" />
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
              location.pathname === '/settings' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Bell className="w-4 h-4" />
            <span>Lembretes</span>
          </NavLink>
          <NavLink
            to="/install"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
              location.pathname === '/install' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Download className="w-4 h-4" />
            <span>Instalar App</span>
          </NavLink>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-9" 
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header - Compact */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-12 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 z-50">
        <Logo size="sm" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
        </Button>
      </header>

      {/* Mobile Settings Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed right-0 top-12 w-56 bg-card border-l border-b border-border rounded-bl-xl z-50 animate-scale-in shadow-lg">
            <div className="p-2 space-y-1">
              <NavLink
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Lembretes</span>
              </NavLink>
              <NavLink
                to="/install"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Instalar App</span>
              </NavLink>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-muted-foreground h-10" 
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sair da conta</span>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-t border-border z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-full px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-10 h-7 rounded-lg transition-colors',
                  isActive && 'bg-primary/10'
                )}>
                  <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                </div>
                <span className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Main Content - Adjusted for mobile bottom nav */}
      <main className="lg:ml-60 pt-12 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="p-4 lg:p-6 max-w-lg lg:max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Floating AI Coach */}
      <FloatingAICoach />
    </div>
  );
}
