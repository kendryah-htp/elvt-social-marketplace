import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Quick health check
    const startTime = Date.now();
    
    // Test database connectivity
    const appCount = await base44.asServiceRole.entities.App.filter({ is_active: true });
    
    const responseTime = Date.now() - startTime;

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: 'connected',
      appsAvailable: appCount.length
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});