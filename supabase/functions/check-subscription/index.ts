import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitStore = new Map<string, { resetAt: number; count: number }>();

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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
    const LIFETIME_PRICE_ID = "price_1TwZJBDYwN6d3g31Rfqy4JAX";
    const LIFETIME_PRODUCT_ID = "prod_UwSDwBDJ5QMucN";

    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found, returning unpaid state");
      return json(200, { subscribed: false, product_id: null, subscription_end: null });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Look for a completed one-time payment for the lifetime price
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 20,
    });

    let paid = false;
    for (const s of sessions.data) {
      if (s.mode !== "payment") continue;
      if (s.payment_status !== "paid") continue;
      const items = await stripe.checkout.sessions.listLineItems(s.id, { limit: 5 });
      const match = items.data.some((li) => li.price?.id === LIFETIME_PRICE_ID);
      if (match) {
        paid = true;
        break;
      }
    }

    logStep(paid ? "Lifetime payment found" : "No lifetime payment found");

    return json(200, {
      subscribed: paid,
      product_id: paid ? LIFETIME_PRODUCT_ID : null,
      subscription_end: null,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return json(500, { error: "Internal error" });
  }
});
