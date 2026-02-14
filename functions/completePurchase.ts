import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      app_id, 
      affiliate_product_id,
      buyer_name, 
      buyer_email, 
      affiliate_slug,
      payment_id 
    } = await req.json();

    // Get app or product details
    let productName, amount, commissionRate, affiliateId;
    
    if (app_id) {
      const apps = await base44.entities.App.filter({ id: app_id });
      const app = apps[0];
      if (!app) throw new Error('App not found');
      
      productName = app.name;
      amount = app.price;
      commissionRate = app.commission_rate || 30;
    } else if (affiliate_product_id) {
      const products = await base44.entities.AffiliateProduct.filter({ id: affiliate_product_id });
      const product = products[0];
      if (!product) throw new Error('Product not found');
      
      productName = product.name;
      amount = product.price;
      commissionRate = 30;
      affiliateId = product.affiliate_id;
    }

    // Get affiliate profile if slug provided
    if (affiliate_slug && !affiliateId) {
      const profiles = await base44.entities.AffiliateProfile.filter({ slug: affiliate_slug });
      if (profiles[0]) {
        affiliateId = profiles[0].id;
      }
    }

    const commissionAmount = (amount * commissionRate) / 100;

    // Create purchase record
    const purchase = await base44.asServiceRole.entities.Purchase.create({
      app_id,
      affiliate_product_id,
      buyer_email,
      buyer_name,
      affiliate_id: affiliateId,
      affiliate_slug: affiliate_slug || null,
      amount,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      payment_status: 'completed',
      payment_id,
      referral_source: affiliate_slug ? 'storefront' : 'direct',
      product_name: productName
    });

    // Update affiliate earnings
    if (affiliateId) {
      const profiles = await base44.asServiceRole.entities.AffiliateProfile.filter({ id: affiliateId });
      const profile = profiles[0];
      if (profile) {
        await base44.asServiceRole.entities.AffiliateProfile.update(affiliateId, {
          total_earnings: (profile.total_earnings || 0) + commissionAmount
        });
      }

      // Mark visit as converted
      if (affiliate_slug) {
        const visits = await base44.asServiceRole.entities.StorefrontVisit.filter({ 
          affiliate_slug,
          converted: false 
        });
        if (visits.length > 0) {
          await base44.asServiceRole.entities.StorefrontVisit.update(visits[0].id, {
            converted: true
          });
        }
      }
    }

    // Send confirmation email
    const emailTemplates = await base44.asServiceRole.entities.EmailTemplate.filter({ 
      trigger: 'purchase_complete',
      is_active: true 
    });
    
    if (emailTemplates[0]) {
      const template = emailTemplates[0];
      const emailBody = template.body
        .replace('{buyer_name}', buyer_name)
        .replace('{app_name}', productName)
        .replace('{amount}', `$${amount}`);
      
      const emailSubject = template.subject
        .replace('{buyer_name}', buyer_name)
        .replace('{app_name}', productName);

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: buyer_email,
        subject: emailSubject,
        body: emailBody
      });
    }

    return Response.json({ 
      success: true, 
      purchase_id: purchase.id,
      commission_earned: affiliateId ? commissionAmount : 0
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});