import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { 
  Download, 
  Smartphone, 
  Share, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  Zap,
  Wifi,
  Bell,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar plataforma
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
    
    // Verificar se já está instalado
    const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);
    setIsInstalled(isInStandaloneMode);

    // Capturar evento de instalação (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detectar quando o app é instalado
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const benefits = [
    {
      icon: Zap,
      title: "Acesso Instantâneo",
      description: "Abra o app direto da sua tela inicial, sem precisar abrir o navegador"
    },
    {
      icon: Wifi,
      title: "Funciona Offline",
      description: "Acesse suas missões e progresso mesmo sem conexão com a internet"
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Receba lembretes das suas missões diárias para não perder nenhum dia"
    },
    {
      icon: Smartphone,
      title: "Experiência Nativa",
      description: "Interface otimizada que funciona como um app nativo no seu dispositivo"
    }
  ];

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            App Instalado! 🎉
          </h1>
          <p className="text-muted-foreground mb-6">
            Você já está usando o FOCUS 30 como aplicativo. Aproveite a experiência completa!
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90">
              Ir para o Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </Link>
          <Logo />
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {/* App Screenshot */}
          <div className="mb-6">
            <img
              src="/app-screenshot.png"
              alt="FOCUS 30 App"
              className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl shadow-primary/20 border border-border/50"
            />
          </div>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
            <Download className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Instale o FOCUS 30
          </h1>
          <p className="text-muted-foreground text-lg">
            Tenha o app na sua tela inicial para acesso rápido às suas missões diárias
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
        >
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Installation Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Android/Desktop - Botão direto */}
          {deferredPrompt && (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-orange-500/5 mb-6">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Pronto para instalar!
                </h2>
                <Button 
                  onClick={handleInstallClick}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white gap-2 text-lg px-8"
                >
                  <Download className="w-5 h-5" />
                  Instalar Agora
                </Button>
              </CardContent>
            </Card>
          )}

          {/* iOS Instructions */}
          {isIOS && !deferredPrompt && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Instalação no iPhone/iPad
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Siga os passos abaixo usando o Safari
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">
                        Toque no botão de compartilhar
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Share className="w-5 h-5" />
                        <span>Na barra inferior do Safari</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">
                        Role e toque em "Adicionar à Tela de Início"
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Plus className="w-5 h-5" />
                        <span>Add to Home Screen</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">
                        Confirme tocando em "Adicionar"
                      </p>
                      <p className="text-muted-foreground text-sm">
                        O ícone do FOCUS 30 aparecerá na sua tela inicial
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Android Instructions (when no prompt available) */}
          {isAndroid && !deferredPrompt && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Instalação no Android
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Siga os passos abaixo usando o Chrome
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">
                        Toque no menu do navegador
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MoreVertical className="w-5 h-5" />
                        <span>Os três pontinhos no canto superior</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">
                        Toque em "Instalar aplicativo" ou "Adicionar à tela inicial"
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Download className="w-5 h-5" />
                        <span>Install app / Add to Home screen</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">
                        Confirme a instalação
                      </p>
                      <p className="text-muted-foreground text-sm">
                        O app será instalado e aparecerá na sua tela inicial
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Desktop Instructions */}
          {!isIOS && !isAndroid && !deferredPrompt && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Instalação no Desktop
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Use Chrome, Edge ou outro navegador compatível
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">
                        Procure o ícone de instalação na barra de endereço
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Geralmente aparece um ícone de + ou de download
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-2">
                        Clique em "Instalar" no diálogo
                      </p>
                      <p className="text-muted-foreground text-sm">
                        O app será instalado e abrirá em sua própria janela
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Após instalar, você pode acessar o FOCUS 30 diretamente da sua tela inicial, 
          sem precisar abrir o navegador.
        </motion.p>
      </main>
    </div>
  );
};

export default Install;
