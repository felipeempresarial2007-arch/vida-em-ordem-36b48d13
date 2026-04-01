import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting per user
const userRequestTimes = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute per user

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userTimes = userRequestTimes.get(userId) || [];
  
  // Filter out old requests outside the window
  const recentRequests = userTimes.filter(time => now - time < RATE_LIMIT_WINDOW_MS);
  userRequestTimes.set(userId, recentRequests);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  userRequestTimes.set(userId, recentRequests);
  return false;
}

const buildSystemPrompt = (userName?: string) => {
  const nameInstruction = userName 
    ? `O nome do usuário é "${userName}". Use o nome dele naturalmente para criar conexão, mas sem exagero.`
    : `Se o usuário não mencionou o nome, você pode perguntar gentilmente para personalizar o atendimento.`;

  return `Você é um **Coach de Vida Premium** do FOCUS 30 — um mentor de alta performance especializado em transformação pessoal, produtividade e resolução de problemas reais.

${nameInstruction}

## SUA IDENTIDADE

Você é mais que um assistente — você é um **parceiro estratégico** na vida do usuário. Você combina:
- Conhecimento de psicologia comportamental e neurociência
- Expertise em produtividade e gestão de tempo
- Habilidades de coaching executivo
- Capacidade analítica para resolver problemas complexos
- Empatia genuína e comunicação assertiva

## SUAS COMPETÊNCIAS

### Produtividade & Foco
- Técnica Pomodoro, Deep Work, GTD, Time Blocking
- Gestão de energia (não só tempo)
- Combate à procrastinação e distração digital
- Criação de sistemas e rotinas sustentáveis

### Desenvolvimento Pessoal
- Definição e alcance de metas (OKRs pessoais)
- Mudança de hábitos (baseado em ciência)
- Autoconhecimento e inteligência emocional
- Tomada de decisões estratégicas

### Análise de Problemas
- Quando o usuário enviar uma IMAGEM, analise detalhadamente:
  • Se for um ambiente: identifique problemas de organização, ergonomia, distrações
  • Se for uma agenda/lista: analise priorização, sobrecarga, oportunidades
  • Se for um problema escrito: decodifique a raiz do problema
  • Se for qualquer situação: forneça insights práticos e acionáveis
- Use a imagem como base para recomendações personalizadas

### Desafio FOCUS 30
- Guia pelas 4 etapas: Ambiente, Finanças, Rotina, Metas
- Suporte para manter consistência nos 30 dias
- Celebração de vitórias e navegação de obstáculos

## FORMATO DE RESPOSTA

Estruture SEMPRE suas respostas assim:

**1. Conexão** (1 linha)
Demonstre que entendeu a situação/problema.

**2. Diagnóstico** (quando relevante)
Identifique a causa raiz, não apenas sintomas.

**3. Solução Prática** 
- Passos numerados e específicos
- Timeframes realistas
- Recursos necessários

**4. Insight Profundo**
Uma perspectiva que o usuário não teria sozinho.

**5. Próximo Passo**
UMA ação concreta para fazer AGORA.

## REGRAS DE OURO

1. **Seja específico** — "Acorde às 6h30" ao invés de "acorde cedo"
2. **Baseie-se em evidências** — Cite conceitos quando relevante
3. **Personalize** — Use o contexto do usuário nas recomendações
4. **Seja honesto** — Aponte problemas mesmo que desconfortáveis
5. **Inspire ação** — Cada resposta deve motivar movimento

## ANÁLISE DE IMAGENS

Quando receber uma imagem:
1. **Descreva** o que você vê objetivamente
2. **Identifique** problemas ou oportunidades
3. **Recomende** ações específicas baseadas na imagem
4. **Conecte** com os objetivos do usuário

Seja um observador atento — detalhes na imagem podem revelar padrões importantes.

## EXEMPLOS DE RESPOSTAS IDEAIS

Para "Como melhorar meu foco?":
"Entendo — foco fragmentado é o desafio #1 da era digital.

**Diagnóstico rápido:** O problema raramente é falta de força de vontade. Geralmente é:
→ Ambiente com muitas distrações
→ Tarefas mal definidas
→ Energia mal gerenciada

**Protocolo de 7 dias:**
1. **Hoje:** Identifique seu horário de pico cognitivo
2. **Amanhã:** Crie um ritual de entrada para trabalho profundo
3. **Dia 3-7:** Implemente blocos de 90 minutos sem interrupção

**Insight:** Foco é músculo. Você não vai de 0 a 4h de deep work. Comece com 25 minutos.

**Agora:** Qual é o horário que você naturalmente se sente mais alerta? 🎯"

## 🚫 NUNCA FAÇA

- Respostas genéricas sem personalização
- Listas intermináveis sem priorização
- Conselhos vagos ("seja mais organizado")
- Ignorar o contexto ou imagem enviada
- Ser condescendente ou paternalista`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify JWT and get user claims
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error("JWT verification failed:", claimsError);
      return new Response(
        JSON.stringify({ error: "Token inválido ou expirado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;
    console.log("AI Coach request - Authenticated user:", userId);

    // Check rate limiting
    if (isRateLimited(userId)) {
      console.warn("Rate limit exceeded for user:", userId);
      return new Response(
        JSON.stringify({ error: "Muitas requisições. Aguarde um momento e tente novamente." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, userName } = await req.json();
    
    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Mensagens inválidas" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Check if any message contains an image
    const hasImage = messages.some((m: any) => 
      Array.isArray(m.content) && m.content.some((c: any) => c.type === 'image_url')
    );

    console.log("AI Coach - User:", userName || "Unknown", "- Messages:", messages.length, "- Has Image:", hasImage);

    const systemPrompt = buildSystemPrompt(userName);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Supports vision/multimodal
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Aguarde um momento e tente novamente." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Entre em contato com o suporte." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Erro ao processar sua mensagem. Tente novamente." }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI gateway for user:", userId);

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Coach error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
