

# Acesso Gratuito para Email Especifico

## Objetivo
Permitir que um email especifico use o app sem precisar pagar, ignorando o sistema de trial e assinatura.

## Abordagem
Adicionar uma lista de emails VIP no hook `useSubscription`. Quando o email do usuario logado estiver nessa lista, o hook retorna `isSubscribed: true` automaticamente, sem consultar o Stripe. Isso desativa o bloqueio de trial e a tela de upgrade.

## Alteracoes

### 1. `src/hooks/useSubscription.ts`
- Adicionar uma constante `VIP_EMAILS` com o(s) email(s) que terao acesso gratuito
- No `checkSubscription`, antes de chamar a edge function, verificar se o email do usuario esta na lista VIP
- Se estiver, setar `isSubscribed: true` e retornar sem chamar o backend

```text
const VIP_EMAILS = ['email@exemplo.com'];

// Dentro de checkSubscription:
if (user.email && VIP_EMAILS.includes(user.email.toLowerCase())) {
  setState({
    isSubscribed: true,
    productId: null,
    subscriptionEnd: null,
    planName: 'VIP',
    isLoading: false,
  });
  return;
}
```

## Proximo passo
Apos aprovacao, vou precisar saber qual email deve ter acesso gratuito para incluir na lista.

