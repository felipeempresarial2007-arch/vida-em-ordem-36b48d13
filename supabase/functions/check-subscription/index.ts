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
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found, returning unsubscribed state");
      return json(200, { subscribed: false, product_id: null, subscription_end: null });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const subscription = subscriptions.data[0];
    const subscribed = !!subscription;

    let productId: string | null = null;
    let subscriptionEnd: string | null = null;

    if (subscription) {
      if (typeof subscription.current_period_end === "number") {
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      }

      const product = subscription.items?.data?.[0]?.price?.product;
      productId = typeof product === "string" ? product : null;

      logStep("Active subscription found", {
        subscriptionId: subscription.id,
        productId,
        subscriptionEnd,
      });
    } else {
      logStep("No active subscription found");
    }

    return json(200, {
      subscribed,
      product_id: productId,
      subscription_end: subscriptionEnd,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return json(500, { error: "Internal error" });
  }
});
