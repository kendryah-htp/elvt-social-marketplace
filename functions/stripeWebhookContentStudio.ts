import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const stripe = await import('npm:stripe@17.0.0');
    const Stripe = stripe.default;
    const stripeClient = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event;
    try {
      event = await stripeClient.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET_CONTENT_STUDIO')
      );
    } catch (err) {
      return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.customer_email;

      if (!userEmail) {
        return Response.json({ success: true });
      }

      // Get subscription ID from session
      const subscription = await stripeClient.subscriptions.list({
        customer: session.customer,
        limit: 1
      });

      if (subscription.data.length > 0) {
        const sub = subscription.data[0];
        
        // Update user subscription in Base44
        const userSubs = await base44.asServiceRole.entities.UserSubscription.filter({
          user_email: userEmail
        });

        if (userSubs.length > 0) {
          await base44.asServiceRole.entities.UserSubscription.update(userSubs[0].id, {
            stripe_subscription_id: sub.id,
            status: 'active'
          });
        } else {
          await base44.asServiceRole.entities.UserSubscription.create({
            user_email: userEmail,
            admin_email: 'system@elvt.social',
            stripe_subscription_id: sub.id,
            subscription_type: 'platform_basic',
            monthly_price: 17.99,
            platform_fee: 17.99,
            admin_margin: 0,
            status: 'active'
          });
        }

        // Send thank you email
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: userEmail,
            subject: 'Welcome to Content Studio - Your Access is Ready!',
            body: `Thank you for subscribing to Content Studio!\n\nYour subscription is now active. You can access Content Studio and start creating amazing content.\n\nManage your subscription: ${session.billing_portal_url || 'https://market.htpelevate.com/ContentStudio'}\n\nHappy creating!\n\nELVT Social Team`
          });
        } catch (emailErr) {
          console.warn('Thank you email failed:', emailErr);
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      
      // Find and deactivate subscription
      const userSubs = await base44.asServiceRole.entities.UserSubscription.filter({
        stripe_subscription_id: subscription.id
      });

      if (userSubs.length > 0) {
        await base44.asServiceRole.entities.UserSubscription.update(userSubs[0].id, {
          status: 'cancelled'
        });
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});