## Objetivo

Substituir as credenciais Google OAuth padrão da Lovable Cloud por credenciais próprias do projeto Focus 30. Isso resolve as falhas de login no preview e faz a tela de consentimento do Google exibir "Focus 30" em vez de "Lovable", aumentando a confiança do usuário.

## Importante

Este processo é **100% configuração externa** (Google Cloud Console + painel da Lovable Cloud). **Nenhum código do projeto será alterado** — o `AuthContext.tsx` e o fluxo `lovable.auth.signInWithOAuth` continuam exatamente como estão.

## Passo a passo

### Etapa 1 — Pegar o Redirect URI da Lovable Cloud

Antes de ir ao Google, copie o redirect URI que vai precisar cadastrar:

1. Abrir **Cloud → Users → Authentication Settings**
2. Localizar a seção **Sign In Methods → Google**
3. Expandir e copiar o **Callback URL** mostrado (algo como `https://mizmiixyztcobcpekqar.supabase.co/auth/v1/callback`)

Guarde essa URL — será usada na Etapa 3.

### Etapa 2 — Configurar a tela de consentimento no Google

1. Acessar https://console.cloud.google.com/
2. Criar um novo projeto (nome sugerido: **Focus 30**) ou usar um existente
3. Menu lateral → **APIs & Services → OAuth consent screen**
4. Tipo de usuário: **External** → Create
5. Preencher:
   - **App name**: Focus 30
   - **User support email**: seu email
   - **App logo**: logo do Focus 30 (opcional, mas recomendado)
   - **Application home page**: `https://focus-30-app.lovable.app`
   - **Privacy policy**: `https://focus-30-app.lovable.app/privacy`
   - **Terms of service**: `https://focus-30-app.lovable.app/terms`
   - **Authorized domains**: adicionar `lovable.app` e `supabase.co`
   - **Developer contact**: seu email
6. **Scopes** → adicionar os 3 scopes não-sensíveis:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
7. **Test users** → publicar o app (botão **Publish App**) para sair do modo de teste e permitir login de qualquer usuário

### Etapa 3 — Criar as credenciais OAuth Client ID

1. Menu lateral → **APIs & Services → Credentials**
2. **Create Credentials → OAuth Client ID**
3. **Application type**: Web application
4. **Name**: Focus 30 Web Client
5. **Authorized JavaScript origins**: adicionar
   - `https://focus-30-app.lovable.app`
   - `https://id-preview--21ef423e-b048-4d16-9591-670909a3dd68.lovable.app`
6. **Authorized redirect URIs**: colar o Callback URL copiado na Etapa 1
7. Clicar em **Create**
8. **Copiar o Client ID e o Client Secret** que aparecem (guarde em local seguro)

### Etapa 4 — Inserir as credenciais na Lovable Cloud

1. Voltar para **Cloud → Users → Authentication Settings → Google**
2. Colar o **Client ID** no campo correspondente
3. Colar o **Client Secret** no campo correspondente
4. Salvar

### Etapa 5 — Validar

1. Fazer logout no app
2. Testar login com Google em https://focus-30-app.lovable.app/auth
3. Confirmar que a tela de consentimento mostra **"Focus 30 quer acessar sua conta"** (não mais "Lovable")
4. Testar também no preview — agora deve funcionar com as suas credenciais

## O que eu (Lovable) vou fazer ao implementar este plano

Como este é um processo de configuração externa, ao aprovar o plano eu vou:

1. Confirmar que **nenhum código precisa ser alterado** (o `lovable.auth.signInWithOAuth("google")` já funciona com credenciais próprias automaticamente)
2. Disponibilizar o atalho rápido para a tela de configuração da Lovable Cloud
3. Fornecer o link direto para o Google Cloud Console
4. Acompanhar você caso encontre erro em alguma etapa

## Tempo estimado

15 a 25 minutos no total, sendo a maior parte na configuração da tela de consentimento do Google.

## Pré-requisito

Você precisa ter uma conta Google (qualquer Gmail serve) para acessar o Google Cloud Console. Não há custo — o OAuth do Google é gratuito.
