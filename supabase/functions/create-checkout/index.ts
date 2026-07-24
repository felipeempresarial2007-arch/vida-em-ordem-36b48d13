import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitStore = new Map<string, { resetAt: number; count: number }>();

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getSafeOrigin(req: Request) {
  const origin = req.headers.get("origin") ?? "";

  const isLocalhost = /^http:\/\/localhost(?::\d+)?$/.test(origin);
  const isLovableHosted = /^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin);
  const isLovableProject = /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin);

  if (origin && (isLocalhost || isLovableHosted || isLovableProject)) return origin;
  return "https://focus-30-app.lovable.app";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { resetAt: now + RATE_LIMIT_WINDOW_MS, count: 1 });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

const ALLOWED_PRICE_IDS = new Set([
  "price_1TwZSeDYwN6d3g31pFU64Kmx",
  "price_1TwZJBDYwN6d3g31Rfqy4JAX", // legacy — kept to avoid breaking pending checkouts
]);

// Pre-initialize Stripe instance at module level for reuse across requests
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = Deno.env.get("STRIPE_SECRET_KEY");
    if (!key) throw new Error("STRIPE_SECRET_KEY not set");
    stripeInstance = new Stripe(key, { apiVersion: "2025-08-27.basil" });
  }
  return stripeInstance;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    let body: any;
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }

    const priceId = body?.priceId;
    const isGuestCheckout = body?.guestCheckout === true;

    if (typeof priceId !== "string" || priceId.length > 128) {
      return json(400, { error: "priceId is required" });
    }

    if (!ALLOWED_PRICE_IDS.has(priceId)) {
      return json(400, { error: "Invalid priceId" });
    }

    let email: string | undefined;
    let userId: string | undefined;
    let customerId: string | undefined;

    const authHeader = req.headers.get("Authorization");
    
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length);

      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
      if (!claimsError && claimsData?.claims) {
        userId = (claimsData.claims as any).sub as string | undefined;
        email = (claimsData.claims as any).email as string | undefined;
        
        if (userId && !checkRateLimit(`user:${userId}`)) {
          return json(429, { error: "Too many requests" });
        }
      }
    }

    if (!email && isGuestCheckout) {
      const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      if (!checkRateLimit(`ip:${clientIP}`)) {
        return json(429, { error: "Too many requests" });
      }
      logStep("Guest checkout requested", { clientIP });
    } else if (!email) {
      return json(401, { error: "Unauthorized" });
    }

    logStep("Processing checkout", { isGuestCheckout, priceId });

    const stripe = getStripe();
    const origin = getSafeOrigin(req);

    // Run customer lookup and session creation in parallel when possible
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      customerId = customers.data[0]?.id;
      if (customerId) logStep("Found existing customer", { customerId });
    }

    const sessionMetadata: Record<string, string> = {};
    if (userId) {
      sessionMetadata.user_id = userId;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-canceled`,
      metadata: Object.keys(sessionMetadata).length > 0 ? sessionMetadata : undefined,
      payment_intent_data: Object.keys(sessionMetadata).length > 0 ? {
        metadata: sessionMetadata,
      } : undefined,
    });

    logStep("Checkout session created", { sessionId: session.id });
    return json(200, { url: session.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return json(500, { error: "Internal error" });
  }
});
