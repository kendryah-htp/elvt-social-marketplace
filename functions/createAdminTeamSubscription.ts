import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { team_name, brand_name, custom_user_price, is_white_label } = body;

    // Create admin team record
    const adminTeam = await base44.entities.AdminTeam.create({
      admin_email: user.email,
      team_name,
      brand_name: brand_name || team_name,
      custom_user_price: custom_user_price || 27, // Default $27 if not specified
      is_white_label: is_white_label || false,
      stripe_price_id: 'price_1T0Sec0490AThCZF6BXcwifn', // $399 base price
      billing_status: 'active'
    });

    return Response.json({
      success: true,
      admin_team: adminTeam,
      message: 'Admin team created successfully. $17/user is automatically retained by platform.'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});