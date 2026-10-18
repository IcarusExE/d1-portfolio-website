import { Hono } from 'hono';
import { z } from 'zod';
import { getSettings } from '../repositories/content.js';

const SETTING_TYPES = {
  name: 'text',
  title: 'text',
  hero: 'text',
  about: 'text',
  email: 'email',
  github_url: 'url',
  linkedin_url: 'url',
};

const optionalWebUrl = z.string().trim().max(2048).refine((value) => {
  if (!value) return true;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, 'Use an HTTP or HTTPS URL.');

const settingsSchema = z.object({
  settings: z.object({
    name: z.string().trim().min(1).max(120),
    title: z.string().trim().min(1).max(220),
    hero: z.string().trim().min(1).max(500),
    about: z.string().trim().min(1).max(5000),
    email: z.union([z.email(), z.literal('')]),
    github_url: optionalWebUrl,
    linkedin_url: optionalWebUrl,
  }),
});

export const settingsRoutes = new Hono();

settingsRoutes.get('/', async (context) => context.json({ settings: await getSettings(context.env.DB) }));

settingsRoutes.put('/', async (context) => {
  const parsed = settingsSchema.safeParse(await context.req.json().catch(() => null));
  if (!parsed.success) {
    return context.json({ error: 'validation_error', message: 'Check the submitted fields.' }, 400);
  }

  const entries = Object.entries(parsed.data.settings);
  if (entries.some(([key]) => !SETTING_TYPES[key])) {
    return context.json({ error: 'unknown_setting', message: 'An unsupported setting was submitted.' }, 400);
  }

  await context.env.DB.batch(
    entries.map(([key, value]) =>
      context.env.DB.prepare(`
        INSERT INTO site_settings (key, value, value_type, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value,
          value_type = excluded.value_type, updated_at = CURRENT_TIMESTAMP
      `).bind(key, value, SETTING_TYPES[key]),
    ),
  );
  return context.json({ settings: await getSettings(context.env.DB) });
});
