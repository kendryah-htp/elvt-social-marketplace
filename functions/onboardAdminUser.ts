import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { new_user_email, admin_id } = body;

    if (!new_user_email || !admin_id) {
      return Response.json({ error: 'Missing new_user_email or admin_id' }, { status: 400 });
    }

    // Verify admin owns this team
    const adminTeams = await base44.entities.AdminTeam.filter({ id: admin_id });
    if (!adminTeams || adminTeams.length === 0) {
      return Response.json({ error: 'Admin team not found' }, { status: 404 });
    }

    const adminTeam = adminTeams[0];
    if (adminTeam.admin_email !== user.email) {
      return Response.json({ error: 'Forbidden: You do not own this team' }, { status: 403 });
    }

    // Create user subscription under this admin
    const userSubscription = await base44.entities.UserSubscription.create({
      user_email: new_user_email,
      admin_email: adminTeam.admin_email,
      subscription_type: 'admin_custom',
      monthly_price: adminTeam.custom_user_price,
      platform_fee: 17,
      admin_margin: adminTeam.custom_user_price - 17,
      status: 'active',
      onboarded_by: user.email
    });

    // Update admin team user count
    await base44.entities.AdminTeam.update(admin_id, {
      monthly_user_count: (adminTeam.monthly_user_count || 0) + 1,
      monthly_mrr: ((adminTeam.monthly_user_count || 0) + 1) * adminTeam.custom_user_price
    });

    return Response.json({
      success: true,
      user_subscription: userSubscription,
      message: `User ${new_user_email} added. Admin earns $${adminTeam.custom_user_price - 17}/month, platform retains $17/month.`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});