import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[PROCESS-REFERRAL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const body = await req.json();
    const { referralCode } = body;

    if (!referralCode) {
      return new Response(JSON.stringify({ error: "Referral code required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find ambassador by referral code
    const { data: ambassador, error: ambassadorError } = await supabaseClient
      .from("ambassadors")
      .select("id, user_id, commission_rate, status")
      .eq("referral_code", referralCode.toUpperCase())
      .single();

    if (ambassadorError || !ambassador) {
      logStep("Ambassador not found", { referralCode });
      return new Response(JSON.stringify({ error: "Invalid referral code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if ambassador is active
    if (ambassador.status !== "active") {
      logStep("Ambassador not active", { status: ambassador.status });
      return new Response(JSON.stringify({ error: "Ambassador not active" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prevent self-referral
    if (ambassador.user_id === user.id) {
      logStep("Self-referral attempted");
      return new Response(JSON.stringify({ error: "Self-referral not allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is already referred
    const { data: existingReferral } = await supabaseClient
      .from("referral_customers")
      .select("id")
      .eq("customer_user_id", user.id)
      .maybeSingle();

    if (existingReferral) {
      logStep("User already referred");
      return new Response(JSON.stringify({ message: "Already referred", alreadyReferred: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get Stripe customer info
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    let stripeCustomerId: string | null = null;
    let subscriptionStatus = "pending";
    let firstPaymentAt: string | null = null;

    if (user.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id;
        
        // Check for active subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          subscriptionStatus = "active";
          const sub = subscriptions.data[0];
          if (sub.current_period_start) {
            firstPaymentAt = new Date(sub.current_period_start * 1000).toISOString();
          }
        } else {
          // Check for trialing subscriptions
          const trialingSubscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: "trialing",
            limit: 1,
          });
          
          if (trialingSubscriptions.data.length > 0) {
            subscriptionStatus = "trial";
          }
        }
      }
    }

    // Create referral customer record
    const { data: referralCustomer, error: insertError } = await supabaseClient
      .from("referral_customers")
      .insert({
        ambassador_id: ambassador.id,
        customer_user_id: user.id,
        stripe_customer_id: stripeCustomerId,
        subscription_status: subscriptionStatus,
        first_payment_at: firstPaymentAt,
        last_payment_at: firstPaymentAt,
        total_paid: 0,
      })
      .select()
      .single();

    if (insertError) {
      logStep("Error creating referral customer", { error: insertError.message });
      return new Response(JSON.stringify({ error: "Failed to process referral" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Referral customer created", { 
      referralCustomerId: referralCustomer.id,
      ambassadorId: ambassador.id,
      status: subscriptionStatus,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      referralId: referralCustomer.id,
      status: subscriptionStatus,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-referral", { message: errorMessage });
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
