import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const { affiliate_slug, referrer } = await req.json();
    
    const base44 = createClientFromRequest(req);
    
    // Hash IP for privacy
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const hashedIp = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
    const visitor_ip = Array.from(new Uint8Array(hashedIp))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16);
    
    await base44.asServiceRole.entities.StorefrontVisit.create({
      affiliate_slug,
      visitor_ip,
      referrer: referrer || 'direct',
      user_agent: req.headers.get('user-agent') || '',
      converted: false
    });
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});