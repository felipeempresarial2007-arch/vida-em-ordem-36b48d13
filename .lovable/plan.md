
Objetivo: estabilizar o login com Google sem “quebrar” o fluxo já existente, melhorando diagnóstico, retorno pós-OAuth e validação no ambiente correto.

1. Confirmar a causa provável
- O projeto já usa o método correto de login social gerenciado (`lovable.auth.signInWithOAuth("google")`).
- Não há indícios no código de implementação incorreta do botão em si.
- A causa mais provável é uma destas:
  - teste no ambiente de preview em vez do publicado
  - retorno do OAuth chegando na rota errada ou sem tratamento completo
  - sessão sendo criada, mas a navegação/UX não deixando isso claro
  - navegador embutido (Instagram/Facebook) atrapalhando o redirecionamento

2. Melhorar o fluxo de retorno do Google
- Ajustar o redirect do login Google para voltar explicitamente para `/auth` em vez da origem genérica.
- No carregamento da página de autenticação, tratar melhor o retorno do OAuth:
  - detectar sucesso de sessão recém-criada
  - exibir feedback visual claro
  - redirecionar automaticamente para `/dashboard` quando o usuário voltar autenticado
- Preservar o parsing atual de `error` e `error_description`, mas deixar a UX mais objetiva.

3. Reforçar o estado de autenticação
- Revisar o `AuthContext` para garantir que o estado de loading termine de forma previsível após retorno do OAuth.
- Validar se `onAuthStateChange` + `getSession()` não estão gerando condição de corrida perceptível no pós-login.
- Garantir que, quando houver sessão, a navegação aconteça sem depender de ação manual do usuário.

4. Melhorar o diagnóstico na interface
- Evoluir a área “Diagnóstico do Google” para mostrar:
  - ambiente atual (preview ou publicado)
  - origem atual
  - redirect efetivo
  - se existe sessão ativa
  - mensagem mais clara quando o usuário estiver em navegador embutido
- Isso ajuda a identificar rapidamente se o problema é de ambiente e não de código.

5. Validar a configuração de ambiente correta
- Testar e orientar o uso do login no domínio publicado, porque o preview pode falhar nesse tipo de autenticação mesmo com o código certo.
- Não alterar `fetch`, CORS ou hacks de proxy.
- Não mexer em arquivos auto-gerados de integração.

6. Ajustes opcionais para robustez
- Adicionar fallback de navegação após retorno do Google, por exemplo:
  - sessão detectada -> navega para `/dashboard`
  - erro detectado -> mantém em `/auth` com mensagem amigável
- Melhorar mensagens para casos comuns:
  - conta cancelou consentimento
  - erro de redirect
  - bloqueio por navegador embutido

Resultado esperado
- Login com Google mais confiável no ambiente publicado
- retorno pós-autenticação mais suave
- diagnóstico mais claro para saber se o problema é ambiente ou fluxo
- menos sensação de “não funciona”, mesmo quando o OAuth retorna corretamente

Detalhes técnicos
- Arquivos principais envolvidos:
  - `src/contexts/AuthContext.tsx`
  - `src/pages/Auth.tsx`
- Não pretendo alterar:
  - `src/integrations/lovable/index.ts`
  - `src/integrations/supabase/client.ts`
- O foco será corrigir fluxo/UX e não reinventar a autenticação.

