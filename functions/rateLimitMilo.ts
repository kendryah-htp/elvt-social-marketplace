import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per user

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.email;
    const now = Date.now();

    // Get user's rate limit data
    const userRateLimit = rateLimitStore.get(userId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

    // Reset if window expired
    if (now > userRateLimit.resetTime) {
      userRateLimit.count = 0;
      userRateLimit.resetTime = now + RATE_LIMIT_WINDOW;
    }

    // Check if limit exceeded
    if (userRateLimit.count >= MAX_REQUESTS) {
      const secondsRemaining = Math.ceil((userRateLimit.resetTime - now) / 1000);
      return Response.json({ 
        error: 'Rate limit exceeded', 
        message: `Too many requests. Please try again in ${secondsRemaining} seconds.`,
        retryAfter: secondsRemaining
      }, { 
        status: 429,
        headers: {
          'Retry-After': secondsRemaining.toString()
        }
      });
    }

    // Increment count
    userRateLimit.count++;
    rateLimitStore.set(userId, userRateLimit);

    // Parse request
    const { prompt, context } = await req.json();

    // Call actual MILO function
    const miloResponse = await base44.functions.invoke('miloChat', { prompt, context });

    return Response.json({
      success: true,
      data: miloResponse.data,
      remainingRequests: MAX_REQUESTS - userRateLimit.count
    });

  } catch (error) {
    console.error('Rate limit error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});