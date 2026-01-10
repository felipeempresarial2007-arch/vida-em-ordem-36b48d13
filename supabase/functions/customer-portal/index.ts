import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
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
  const isLovableHosted = /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin);

  if (origin && (isLocalhost || isLovableHosted)) return origin;
  return "https://lovable.dev";
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json(500, { error: "Server misconfigured" });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json(401, { error: "Unauthorized" });
    }

    const token = authHeader.slice("Bearer ".length);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      logStep("Invalid JWT", { claimsError: claimsError?.message });
      return json(401, { error: "Unauthorized" });
    }

    const userId = (claimsData.claims as any).sub as string | undefined;
    const email = (claimsData.claims as any).email as string | undefined;

    if (!userId || !email) {
      return json(401, { error: "Unauthorized" });
    }

    if (!checkRateLimit(`user:${userId}`)) {
      return json(429, { error: "Too many requests" });
    }

    logStep("User authenticated", { userId, email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return json(404, { error: "No customer found" });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const origin = getSafeOrigin(req);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/`,
    });

    logStep("Customer portal session created", { sessionId: portalSession.id });
    return json(200, { url: portalSession.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in customer-portal", { message: errorMessage });
    return json(500, { error: "Internal error" });
  }
});
