import { Hono } from 'hono';

const app = new Hono();

app.get('/api/health', (context) => context.json({ status: 'ok' }));

app.get('/admin', (context) => context.env.ASSETS.fetch(new Request(new URL('/admin.html', context.req.url))));
app.get('/admin/', (context) => context.redirect('/admin', 308));

app.all('*', (context) => context.env.ASSETS.fetch(context.req.raw));

export default app;
