import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { amount, currency, payment_method, metadata } = await req.json();

    // Validate required fields
    if (!amount || !payment_method) {
      return Response.json({ error: 'amount and payment_method required' }, { status: 400 });
    }

    // Call Stripe API directly to create payment intent
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return Response.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: String(amount),
        currency: currency || 'usd',
        payment_method,
        confirm: 'true',
        automatic_payment_methods: JSON.stringify({ enabled: true, allow_redirects: 'never' }),
        metadata: JSON.stringify(metadata || {})
      })
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      return Response.json({ error: paymentIntent.error?.message || 'Payment failed' }, { status: 400 });
    }

    return Response.json({ paymentIntent });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});