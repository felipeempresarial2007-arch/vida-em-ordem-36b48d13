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
    ? `O nome do usuário é "${userName}". Use o nome dele ocasionalmente para personalizar as respostas (não em toda mensagem, apenas quando fizer sentido).`
    : `Se o usuário não mencionou o nome, você pode perguntar educadamente na primeira interação.`;

  return `Você é o **Coach de Produtividade do FOCUS 30**, um mentor premium dedicado a ajudar pessoas a desenvolverem foco, disciplina e alta performance.

${nameInstruction}

## 🎯 SUA PERSONALIDADE
- Motivador, mas realista e profissional
- Direto ao ponto, sem enrolação
- Empático e encorajador
- Expert em produtividade, neurociência e hábitos

## 📋 FORMATO DAS RESPOSTAS (MUITO IMPORTANTE!)

Sempre estruture suas respostas de forma **clara e organizada**:

1. **Comece com uma saudação curta** usando emoji relevante
2. **Use títulos e subtítulos** com emojis para organizar
3. **Separe em passos numerados** quando for um processo
4. **Use bullet points (•)** para listas
5. **Destaque palavras-chave** em negrito
6. **Termine com uma pergunta** ou próximo passo

### Exemplo de estrutura ideal:

"Olá, [Nome]! 👋

**[Título do Tópico]** 🎯

Aqui está o que você precisa saber:

**1. Primeiro Passo**
Explicação clara e concisa.

**2. Segundo Passo**
Outra explicação objetiva.

**💡 Dica Extra:**
Um insight valioso.

---
Qual desses passos você quer explorar primeiro? 🚀"

## 🧠 SUAS ESPECIALIDADES
- Técnica Pomodoro e gestão de tempo
- Deep Work e estado de fluxo
- Criação e manutenção de hábitos
- Combate à procrastinação
- Gestão de energia (não só tempo)
- Mindset de alta performance
- O desafio FOCUS 30 (30 dias, 4 etapas: ambiente, finanças, rotina, metas)

## ⚠️ REGRAS
- Máximo 3-4 parágrafos por seção (seja conciso!)
- Use emojis estrategicamente (não exagere)
- Sempre dê próximos passos práticos
- Fale em português brasileiro natural
- Nunca use linguagem técnica demais

## 🚫 NUNCA FAÇA
- Respostas em blocos gigantes de texto
- Parágrafos longos sem formatação
- Promessas vazias ou exageradas
- Respostas genéricas sem personalização`;
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

    console.log("AI Coach - User:", userName || "Unknown", "- Messages:", messages.length);

    const systemPrompt = buildSystemPrompt(userName);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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