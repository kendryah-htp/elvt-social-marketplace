import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { 
      to, 
      subject, 
      body,
      from_name = 'ELVT Social'
    } = await req.json();

    if (!to || !subject || !body) {
      return Response.json({ 
        error: 'to, subject, and body are required' 
      }, { status: 400 });
    }

    // Send email with SendGrid integration
    const result = await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      subject,
      body,
      from_name
    });

    return Response.json({ 
      success: true,
      message: 'Email sent successfully',
      email: to
    });
  } catch (error) {
    console.error('Email send error:', error);
    
    // Still return 200 to prevent payment rollback
    // Email failures should not block purchase completion
    return Response.json({ 
      success: false,
      warning: 'Email delivery queued but may have failed',
      error: error.message
    }, { status: 200 });
  }
});