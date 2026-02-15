import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-12-18.acacia',
});

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      return Response.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    const body = await req.text();
    
    // Create base44 client from request
    const base44 = createClientFromRequest(req);

    // Verify webhook signature using async method
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract metadata
      const { app_id, affiliate_slug, affiliate_id } = session.metadata || {};
      
      if (!app_id) {
        console.error('No app_id in session metadata');
        return Response.json({ error: 'Missing app_id' }, { status: 400 });
      }

      // Fetch app details
      const apps = await base44.asServiceRole.entities.App.filter({ id: app_id });
      const app = apps[0];
      
      if (!app) {
        console.error('App not found:', app_id);
        return Response.json({ error: 'App not found' }, { status: 404 });
      }

      // Get affiliate profile if affiliate tracking exists
      let affiliate = null;
      if (affiliate_slug) {
        const profiles = await base44.asServiceRole.entities.AffiliateProfile.filter({ slug: affiliate_slug });
        affiliate = profiles[0];
      }

      // Calculate commission
      const amount = session.amount_total / 100; // Convert from cents
      const commissionRate = affiliate?.commission_rate || app.commission_rate || 30;
      const commissionAmount = (amount * commissionRate) / 100;

      // Create purchase record
      const purchase = await base44.asServiceRole.entities.Purchase.create({
        app_id: app.id,
        buyer_email: session.customer_details.email,
        buyer_name: session.customer_details.name,
        affiliate_id: affiliate?.id || null,
        affiliate_slug: affiliate_slug || null,
        amount: amount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        payment_status: 'completed',
        payment_id: session.payment_intent,
        referral_source: affiliate_slug ? 'ref_link' : 'direct',
        product_name: app.name
      });

      // Update affiliate earnings if exists
      if (affiliate) {
        await base44.asServiceRole.entities.AffiliateProfile.update(affiliate.id, {
          total_earnings: (affiliate.total_earnings || 0) + commissionAmount
        });

        // Mark storefront visit as converted
        const visits = await base44.asServiceRole.entities.StorefrontVisit.filter({
          affiliate_slug: affiliate_slug,
          converted: false
        });
        
        if (visits.length > 0) {
          await base44.asServiceRole.entities.StorefrontVisit.update(visits[0].id, {
            converted: true
          });
        }
      }

      // Send purchase confirmation email
      try {
        const emailBody = `
Hi ${session.customer_details.name},

Thank you for your purchase of ${app.name}!

Order Details:
- Product: ${app.name}
- Amount: $${amount.toFixed(2)}
- Transaction ID: ${session.payment_intent}

${app.description || 'You now have access to this premium app.'}

If you have any questions, please contact our support team.

Best regards,
ELVT Social Team
        `.trim();

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: session.customer_details.email,
          subject: `Your ${app.name} Purchase Confirmation`,
          body: emailBody,
          from_name: 'ELVT Social'
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the webhook if email fails
      }

      return Response.json({ 
        success: true, 
        purchase_id: purchase.id,
        commission_amount: commissionAmount 
      });
    }

    // Handle refund events
    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const paymentIntent = charge.payment_intent;

      // Find purchase by payment_id
      const purchases = await base44.asServiceRole.entities.Purchase.filter({ 
        payment_id: paymentIntent 
      });

      if (purchases.length > 0) {
        const purchase = purchases[0];
        
        // Update purchase status
        await base44.asServiceRole.entities.Purchase.update(purchase.id, {
          payment_status: 'refunded'
        });

        // Deduct commission from affiliate if applicable
        if (purchase.affiliate_id) {
          const affiliate = await base44.asServiceRole.entities.AffiliateProfile.filter({ 
            id: purchase.affiliate_id 
          });
          
          if (affiliate.length > 0) {
            const currentEarnings = affiliate[0].total_earnings || 0;
            await base44.asServiceRole.entities.AffiliateProfile.update(purchase.affiliate_id, {
              total_earnings: Math.max(0, currentEarnings - purchase.commission_amount)
            });
          }
        }
      }

      return Response.json({ success: true, refund_processed: true });
    }

    return Response.json({ success: true, event_type: event.type });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});