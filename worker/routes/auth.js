import { Hono } from 'hono';
import { z } from 'zod';
import {
  clearSessionCookie,
  createSession,
  currentSession,
  setSessionCookie,
  verifyPassword,
} from '../middleware/auth.js';

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(8).max(256),
});

export const authRoutes = new Hono();

authRoutes.get('/session', async (context) => {
  const session = await currentSession(context);
  return session
    ? context.json({ authenticated: true, username: session.sub })
    : context.json({ authenticated: false }, 401);
});

authRoutes.post('/login', async (context) => {
  const rateLimitKey = context.req.header('CF-Connecting-IP') || 'local';
  if (context.env.LOGIN_RATE_LIMITER) {
    const outcome = await context.env.LOGIN_RATE_LIMITER.limit({ key: rateLimitKey });
    if (!outcome.success) {
      return context.json({ error: 'rate_limited', message: 'Too many login attempts. Try again shortly.' }, 429);
    }
  }

  const parsed = credentialsSchema.safeParse(await context.req.json().catch(() => null));
  if (!parsed.success) return context.json({ error: 'invalid_credentials', message: 'Invalid credentials.' }, 401);

  const usernameMatches = parsed.data.username === context.env.ADMIN_USERNAME;
  const passwordMatches = await verifyPassword(parsed.data.password, context.env.ADMIN_PASSWORD_HASH);
  if (!usernameMatches || !passwordMatches) {
    return context.json({ error: 'invalid_credentials', message: 'Invalid credentials.' }, 401);
  }

  const token = await createSession(parsed.data.username, context.env.SESSION_SECRET);
  setSessionCookie(context, token);
  return context.json({ authenticated: true, username: parsed.data.username });
});

authRoutes.post('/logout', (context) => {
  clearSessionCookie(context);
  return context.json({ authenticated: false });
});
