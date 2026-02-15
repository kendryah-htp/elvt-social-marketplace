import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const { user_email } = await req.json();

    if (!user_email) {
      return Response.json({ error: 'user_email required' }, { status: 400 });
    }

    // Get user's subscription
    const subs = await base44.entities.UserSubscription.filter({
      user_email
    });

    if (!subs[0]?.stripe_subscription_id) {
      return Response.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const stripe = await import('npm:stripe@17.0.0');
    const Stripe = stripe.default;
    const stripeClient = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    // Get customer from subscription
    const subscription = await stripeClient.subscriptions.retrieve(subs[0].stripe_subscription_id);

    // Create billing portal session
    const session = await stripeClient.billingPortal.sessions.create({
      customer: subscription.customer,
      return_url: 'https://market.htpelevate.com/BillingPortal'
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});