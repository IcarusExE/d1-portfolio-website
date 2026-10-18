import { Hono } from 'hono';
import { securityHeaders } from './middleware/security.js';
import { requireAdmin } from './middleware/auth.js';
import { authRoutes } from './routes/auth.js';
import { projectRoutes } from './routes/projects.js';
import { skillRoutes } from './routes/skills.js';
import { settingsRoutes } from './routes/settings.js';
import { getPublicContent } from './repositories/content.js';

const app = new Hono();

app.use('*', securityHeaders);
app.onError((error, context) => {
  console.error(error);
  return context.json({ error: 'internal_error', message: 'The request could not be completed.' }, 500);
});

app.get('/api/health', (context) => context.json({ status: 'ok' }));
app.get('/api/public', async (context) => context.json(await getPublicContent(context.env.DB)));
app.route('/api/auth', authRoutes);

app.use('/api/admin/*', requireAdmin);
app.route('/api/admin/projects', projectRoutes);
app.route('/api/admin/skills', skillRoutes);
app.route('/api/admin/settings', settingsRoutes);

app.all('*', (context) => context.env.ASSETS.fetch(context.req.raw));

export default app;
