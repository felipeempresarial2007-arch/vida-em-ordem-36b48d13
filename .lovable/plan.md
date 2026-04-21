

# Plan: Compatibilidade Total com iOS (iPhone/iPad)

## Diagnóstico
Após varredura completa do código, identifiquei pontos críticos que prejudicam a experiência no iOS (Safari mobile, Chrome iOS, e PWA instalada na tela de início). Abaixo, as correções necessárias para que **todas as abas** funcionem perfeitamente em iPhone/iPad.

## Problemas Encontrados e Correções

### 1. Bottom Navigation cortada pela barra inferior do iPhone
**Problema:** A barra de navegação mobile usa `h-[72px]` + `safe-area-bottom`, mas o `padding-bottom` é aplicado por dentro, então ícones ficam colados na borda do home indicator no iPhone X+.
**Correção:** Ajustar `AppLayout.tsx` para somar a altura do safe-area, e o `<main>` precisa de `pb-[calc(72px+env(safe-area-inset-bottom))]` para o conteúdo não ficar escondido atrás da nav.

### 2. Header mobile colado na status bar (notch/Dynamic Island)
**Problema:** O `<header>` mobile usa `top-0 h-12` sem respeitar a `safe-area-inset-top`. Em iPhones com notch (X+), o logo fica atrás da câmera.
**Correção:** Adicionar `pt-[env(safe-area-inset-top)]` ao header e ajustar o `<main>` `pt-` correspondente.

### 3. Viewport com zoom e pinch quebrando layouts
**Problema:** O meta viewport tem `maximum-scale=1.0, user-scalable=no` — isso pode causar zoom indesejado em inputs no iOS quando o `font-size < 16px`.
**Correção:** Garantir que todos os `<input>`, `<textarea>` e `<select>` tenham `font-size: 16px` mínimo no mobile (regra global no `index.css`), evitando o auto-zoom do Safari ao focar.

### 4. Altura `100vh` quebra com a barra dinâmica do Safari iOS
**Problema:** `AICoach.tsx` usa `h-[calc(100vh-8rem)]` e `FloatingAICoach.tsx` usa `max-h-[calc(100vh-8rem)]`. No Safari iOS, `100vh` inclui a barra de URL retrátil, causando conteúdo cortado.
**Correção:** Substituir `100vh` por `100dvh` (dynamic viewport height) nesses componentes e também no `min-h-screen` do `AppLayout`.

### 5. Áudio de boas-vindas bloqueado no iOS
**Problema:** `useWelcomeSound.ts` tenta tocar `audio.play()` automaticamente. iOS Safari **bloqueia 100%** autoplay sem interação prévia do usuário, gerando warning silencioso.
**Correção:** Aguardar a primeira interação do usuário (`click`/`touchstart`) antes de tocar o som — usar listener `once`.

### 6. Notificações Push não funcionam em iOS sem PWA instalada
**Problema:** O `NotificationPrompt` aparece em qualquer iOS, mas iOS **só aceita Web Notifications a partir do iOS 16.4 e SOMENTE quando o app está instalado na tela inicial (PWA standalone)**.
**Correção:** Detectar `navigator.standalone === true` (iOS) ou `display-mode: standalone`. Se for iOS Safari fora do modo PWA, esconder o prompt e mostrar um aviso amigável "Para receber lembretes no iPhone, instale o app na tela inicial" com link para `/install`.

### 7. Checkout do Stripe em iOS Safari (popup blocker)
**Status:** Já está usando `window.location.href` corretamente (memória `ios-safari-compatibility`), mas o `FloatingWhatsApp` ainda usa `window.open(..., '_blank')` que pode ser bloqueado.
**Correção:** Trocar `window.open` do WhatsApp por `window.location.href` ou link `<a href target="_blank" rel="noopener">` (mais confiável em iOS).

### 8. Backdrop-filter / blur causando lag em iPhones antigos
**Problema:** Múltiplos `backdrop-blur-xl` em `AppLayout`, `NotificationPrompt`, `TrialPaywall` podem causar travamento em iPhone 8/SE.
**Correção:** Adicionar fallback `@supports not (backdrop-filter: blur())` que usa background sólido com leve transparência.

### 9. Scroll travado dentro do `TrialPaywall` em telas pequenas
**Problema:** Modal usa `overflow-y-auto` mas sem `-webkit-overflow-scrolling: touch`, causando scroll travado em iPhones.
**Correção:** Adicionar regra global no CSS para scroll suave em containers iOS.

### 10. PWA Manifest — ícone Apple Touch e splash screen
**Problema:** Apenas um `apple-touch-icon` 180x180. iOS exige tamanhos múltiplos (152, 167, 180) e um `apple-touch-startup-image` para a splash da PWA instalada.
**Correção:** Adicionar links para múltiplos tamanhos no `index.html` (mesmo que o arquivo seja o mesmo, iOS prioriza por dimensão declarada).

## Arquivos a Editar

```text
index.html                                    → meta tags iOS, apple-touch-icons múltiplos
src/index.css                                 → font-size 16px em inputs, scroll iOS,
                                                 100dvh, fallback backdrop-filter
src/components/layout/AppLayout.tsx           → safe-area top/bottom corrigida, dvh
src/hooks/useWelcomeSound.ts                  → tocar após primeira interação
src/components/reminders/NotificationPrompt.tsx → detectar iOS sem PWA, ocultar/avisar
src/components/landing/FloatingWhatsApp.tsx   → trocar window.open por link nativo
src/pages/AICoach.tsx                         → 100vh → 100dvh
src/components/ai/FloatingAICoach.tsx         → 100vh → 100dvh
```

## Resultado Esperado
- Todas as abas (Dashboard, Ambiente, Finanças, Rotina, Metas, Continuação, Coach AI, Configurações) navegáveis sem corte por notch ou home indicator.
- Inputs sem zoom automático.
- Checkout Stripe e WhatsApp funcionando em Safari iOS sem bloqueio.
- Notificações respeitam as limitações do iOS com mensagem clara.
- PWA instalada com ícone correto e splash screen na home do iPhone.
- Performance fluida em iPhones a partir do iOS 14.

