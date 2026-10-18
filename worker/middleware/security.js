const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function securityHeaders(context, next) {
  if (MUTATING_METHODS.has(context.req.method)) {
    const requestOrigin = context.req.header('Origin');
    const currentOrigin = new URL(context.req.url).origin;
    const allowedOrigin = context.env.ALLOWED_ORIGIN || currentOrigin;

    if (requestOrigin && requestOrigin !== allowedOrigin && requestOrigin !== currentOrigin) {
      return context.json({ error: 'invalid_origin', message: 'Request origin is not allowed.' }, 403);
    }
  }

  await next();

  context.header('X-Content-Type-Options', 'nosniff');
  context.header('X-Frame-Options', 'DENY');
  context.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  context.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  context.header(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' https: data:; connect-src 'self'; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  );
}
