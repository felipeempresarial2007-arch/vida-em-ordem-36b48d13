import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, ArrowRight, Target, Zap, Shield, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleInAppDialog, setShowGoogleInAppDialog] = useState(false);
  const [oauthError, setOauthError] = useState<{ error: string; description?: string } | null>(null);
  const [oauthReturning, setOauthReturning] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const googleRedirectTo = `${window.location.origin}/auth`;

  const isPreview = window.location.hostname.includes('id-preview--');
  const isInApp = isInAppBrowser();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copiado!');
    } catch {
      toast.error('Não foi possível copiar automaticamente. Copie manualmente.');
    }
  };

  // Detect OAuth return and show loading state
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    const hasOAuthParams = hash.includes('access_token') || hash.includes('error') || search.includes('error') || search.includes('code=');
    
    if (hasOAuthParams) {
      setOauthReturning(true);
      console.log('[Auth] OAuth return detected');
    }
  }, []);

  // Auto-navigate to dashboard when user session is established
  useEffect(() => {
    if (!authLoading && user) {
      console.log('[Auth] Session detected, navigating to dashboard');
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Parse OAuth errors from URL
  useEffect(() => {
    const safeDecode = (value: string) => {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    };

    const fromSearch = new URLSearchParams(window.location.search);
    const fromHash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

    const error = fromSearch.get('error') ?? fromHash.get('error');
    const descriptionRaw = fromSearch.get('error_description') ?? fromHash.get('error_description');

    if (!error) return;

    setOauthReturning(false);

    const info = {
      error,
      description: descriptionRaw ? safeDecode(descriptionRaw) : undefined,
    };

    setOauthError(info);

    if (error === 'access_denied') {
      toast.error('Acesso negado pelo Google. Verifique se sua conta está autorizada.');
    } else if (error.toLowerCase().includes('redirect')) {
      toast.error('Erro de redirecionamento do Google. Tente novamente.');
    } else {
      toast.error(`Falha no login com Google: ${error}`);
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  function isInAppBrowser() {
    const ua = navigator.userAgent || '';
    return /Instagram|FBAN|FBAV|FB_IAB|Messenger|Line|TikTok|LinkedInApp/i.test(ua);
  }

  const startGoogleOAuth = async () => {
    setGoogleLoading(true);
    try {
      console.log('[Google OAuth] Starting sign in, redirect:', googleRedirectTo);
      const { error } = await signInWithGoogle(googleRedirectTo);
      if (error) {
        console.error('[Google OAuth] Error:', error.message);
        toast.error(`Erro ao entrar com Google: ${error.message}`);
      }
    } catch (err: any) {
      console.error('[Google OAuth] Unexpected error:', err);
      toast.error(`Erro inesperado: ${err?.message || 'desconhecido'}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isInApp) {
      setShowGoogleInAppDialog(true);
      return;
    }

    await startGoogleOAuth();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error('Erro ao enviar email de recuperação');
        } else {
          toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
          setIsForgotPassword(false);
        }
      } else if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Bem-vindo de volta!');
          navigate('/dashboard');
        }
      } else {
        if (!fullName.trim()) {
          toast.error('Por favor, informe seu nome');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Conta criada com sucesso!');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Target, text: '30 dias de missões guiadas' },
    { icon: Zap, text: 'Organize ambiente, finanças e rotina' },
    { icon: Shield, text: 'Acompanhe seu progresso diário' },
  ];

  // Show loading screen when returning from OAuth
  if (oauthReturning && !oauthError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-lg font-medium text-foreground">Conectando com Google...</p>
          <p className="text-sm text-muted-foreground">Aguarde enquanto verificamos sua conta</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted/30">
      <AlertDialog open={showGoogleInAppDialog} onOpenChange={setShowGoogleInAppDialog}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Abrir no navegador</AlertDialogTitle>
            <AlertDialogDescription>
              O login com Google pode dar erro dentro do navegador do Instagram/Facebook. Para funcionar, abra este site no
              Safari/Chrome e tente novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                window.open(window.location.href, '_blank', 'noopener,noreferrer');
                toast.message('Se não abrir, copie o link e cole no Safari/Chrome.');
              }}
            >
              Abrir no navegador
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowGoogleInAppDialog(false);
                void startGoogleOAuth();
              }}
            >
              Tentar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Left Side - Premium Branding with Sophisticated Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-hover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Logo size="lg" className="[&_span]:text-white [&_.text-foreground]:text-white mb-12" />
            
            <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
              Transforme sua vida em 30 dias
            </h1>
            <p className="text-white/75 text-lg leading-relaxed font-light">
              Um desafio estruturado para organizar seu ambiente, finanças, 
              rotina e metas.
            </p>

            <div className="mt-12 space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: "easeOut" }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-lg shadow-black/10 group-hover:bg-white/20 transition-colors duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-white/90 text-base font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Premium Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo with gradient background */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 mb-4">
              <Logo size="lg" className="justify-center" />
            </div>
          </div>

          <Card className="border-border/50 shadow-2xl shadow-black/5 rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Premium header accent */}
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary-hover to-primary" />
            
            <CardHeader className="text-center pb-2 pt-8 px-8">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {isForgotPassword ? 'Recuperar senha' : isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
              </CardTitle>
              <CardDescription className="text-sm mt-2 text-muted-foreground/80">
                {isForgotPassword
                  ? 'Digite seu email para receber um link de recuperação'
                  : isLogin 
                    ? 'Entre para continuar sua jornada de transformação' 
                    : 'Comece sua jornada de transformação hoje'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && !isForgotPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin && !isForgotPassword}
                      className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                  />
                </div>
                {!isForgotPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-xs text-primary hover:text-primary-hover font-medium transition-colors"
                        >
                          Esqueci a senha
                        </button>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 mt-3 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isForgotPassword ? 'Enviar link' : isLogin ? 'Entrar' : 'Criar conta'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground/60 font-medium">ou continue com</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border-border/60 hover:bg-muted/50 hover:border-border transition-all duration-300"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-medium">Google</span>
                  </>
                )}
              </Button>

              {oauthError && (
                <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive break-words">
                    <span className="font-semibold">Erro:</span> {oauthError.error}
                    {oauthError.description ? <> — {oauthError.description}</> : null}
                  </p>
                </div>
              )}

              <details className="mt-4 rounded-2xl border border-border/50 bg-muted/20 overflow-hidden">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground p-4 hover:bg-muted/40 transition-colors">
                  Diagnóstico do Google
                </summary>
                <div className="p-4 pt-0 space-y-3 text-xs text-muted-foreground">
                  <p>
                    Origem: <span className="font-medium break-all text-foreground/70">{window.location.origin}</span>
                  </p>
                  <p>
                    Redirect: <span className="font-medium break-all text-foreground/70">{googleRedirectTo}</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => copyToClipboard(`${window.location.origin}/*`)}>
                      Copiar origem/*
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => copyToClipboard(googleRedirectTo)}>
                      Copiar redirect
                    </Button>
                  </div>
                </div>
              </details>

              <div className="mt-6 text-center">
                {isForgotPassword ? (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="text-primary font-semibold hover:text-primary-hover transition-colors">← Voltar ao login</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-muted-foreground/80 hover:text-foreground transition-colors"
                  >
                    {isLogin ? (
                      <>Não tem conta? <span className="text-primary font-semibold hover:text-primary-hover transition-colors">Criar agora</span></>
                    ) : (
                      <>Já tem conta? <span className="text-primary font-semibold hover:text-primary-hover transition-colors">Fazer login</span></>
                    )}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-muted-foreground/60">
              Seus dados estão seguros e protegidos
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
