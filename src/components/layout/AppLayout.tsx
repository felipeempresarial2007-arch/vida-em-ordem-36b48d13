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
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'Visão geral' },
  { path: '/ambiente', label: 'Ambiente', icon: Home, description: 'Organize seu espaço' },
  { path: '/financas', label: 'Finanças', icon: Wallet, description: 'Controle financeiro' },
  { path: '/rotina', label: 'Rotina', icon: Heart, description: 'Hábitos saudáveis' },
  { path: '/metas', label: 'Metas', icon: Target, description: 'Seus objetivos' },
  { path: '/continuacao', label: 'Continuação', icon: Infinity, description: 'Além dos 30 dias' },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Premium Design */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-card border-r border-border/60 z-50">
        {/* Logo */}
        <div className="p-6 border-b border-border/60">
          <Logo size="md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3">
              Menu Principal
            </span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-muted group-hover:bg-primary/10'
                )}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium block">{item.label}</span>
                  {!isActive && (
                    <span className="text-[10px] text-muted-foreground/70">{item.description}</span>
                  )}
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 opacity-70" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border/60">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl h-11" 
            onClick={signOut}
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <LogOut className="w-[18px] h-[18px]" />
            </div>
            <span className="text-sm font-medium">Sair da conta</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-xl border-b border-border/60 flex items-center justify-between px-4 z-50">
        <Logo size="sm" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-10 h-10 rounded-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed right-0 top-16 bottom-0 w-72 bg-card border-l border-border/60 z-50 animate-slide-in-right overflow-y-auto">
            <nav className="p-4 space-y-1">
              <div className="mb-4 px-3">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Menu Principal
                </span>
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isActive ? 'bg-white/20' : 'bg-muted'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium block">{item.label}</span>
                      <span className={cn(
                        'text-[10px]',
                        isActive ? 'text-white/70' : 'text-muted-foreground'
                      )}>{item.description}</span>
                    </div>
                  </NavLink>
                );
              })}
              <div className="pt-4 mt-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-muted-foreground h-12 rounded-xl" 
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">Sair da conta</span>
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Floating AI Coach */}
      <FloatingAICoach />
    </div>
  );
}
