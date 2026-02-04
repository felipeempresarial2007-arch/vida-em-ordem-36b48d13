import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { FloatingAICoach } from '@/components/ai/FloatingAICoach';
import { NotificationPrompt } from '@/components/reminders/NotificationPrompt';
import { supabase } from '@/integrations/supabase/client';
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
  Users,
  Shield,
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
  const { signOut, isAdmin, isAmbassador } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col bg-card/95 backdrop-blur-xl border-r border-border/60">
        <div className="h-14 flex items-center px-5 border-b border-border/60">
          <Logo size="md" />
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/60 space-y-1">
          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              location.pathname === '/settings' 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Bell className="w-4 h-4" />
            <span>Lembretes</span>
          </NavLink>
          <NavLink
            to="/install"
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              location.pathname === '/install' 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Download className="w-4 h-4" />
            <span>Instalar App</span>
          </NavLink>
          
          {/* Ambassador Link */}
          {isAmbassador && (
            <NavLink
              to="/embaixador"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                location.pathname === '/embaixador' 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Users className="w-4 h-4" />
              <span>Embaixador</span>
            </NavLink>
          )}
          
          {/* Admin Link */}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                location.pathname === '/admin' 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </NavLink>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-10 rounded-xl" 
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header - Premium glass effect */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-12 bg-card/90 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 z-50">
        <Logo size="sm" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-9 h-9 rounded-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
        </Button>
      </header>

      {/* Mobile Settings Menu - Premium */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-foreground/5 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed right-2 top-14 w-52 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl z-50 animate-scale-in shadow-xl">
            <div className="p-2 space-y-1">
              <NavLink
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Lembretes</span>
              </NavLink>
              <NavLink
                to="/install"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Instalar App</span>
              </NavLink>
              
              {/* Ambassador Link Mobile */}
              {isAmbassador && (
                <NavLink
                  to="/embaixador"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Embaixador</span>
                </NavLink>
              )}
              
              {/* Admin Link Mobile */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </NavLink>
              )}
              
              <div className="h-px bg-border/60 my-1" />
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-muted-foreground h-10 rounded-xl" 
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

      {/* Mobile Bottom Navigation - Premium glass */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-card/90 backdrop-blur-xl border-t border-border/50 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-11 h-8 rounded-xl transition-all duration-200',
                  isActive && 'bg-primary/12 shadow-sm'
                )}>
                  <Icon className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-105')} />
                </div>
                <span className={cn(
                  'text-[10px] font-semibold tracking-tight',
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

      {/* Notification Prompt */}
      <NotificationPrompt />
    </div>
  );
}
