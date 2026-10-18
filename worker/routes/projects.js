import { Hono } from 'hono';
import { z } from 'zod';
import { listProjects } from '../repositories/content.js';

const webUrl = z.string().trim().max(2048).refine((value) => {
  if (!value) return true;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, 'Use an HTTP or HTTPS URL.');

const projectSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title_tr: z.string().trim().min(1).max(160),
  title_en: z.string().trim().min(1).max(160),
  summary_tr: z.string().trim().min(1).max(500),
  summary_en: z.string().trim().min(1).max(500),
  description_tr: z.string().trim().max(5000).default(''),
  description_en: z.string().trim().max(5000).default(''),
  image_url: webUrl.default(''),
  live_url: webUrl.default(''),
  source_url: webUrl.default(''),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  sort_order: z.coerce.number().int().min(0).max(10000).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

const orderSchema = z.object({
  items: z.array(z.object({ id: z.number().int().positive(), sort_order: z.number().int().min(0).max(10000) })).max(200),
});

function invalid(context, issues) {
  return context.json({ error: 'validation_error', message: 'Check the submitted fields.', issues }, 400);
}

function values(project) {
  return [
    project.slug,
    project.title_tr,
    project.title_en,
    project.summary_tr,
    project.summary_en,
    project.description_tr,
    project.description_en,
    project.image_url,
    project.live_url,
    project.source_url,
    JSON.stringify(project.technologies),
    project.sort_order,
    Number(project.featured),
    Number(project.published),
  ];
}

export const projectRoutes = new Hono();

projectRoutes.get('/', async (context) => context.json({ projects: await listProjects(context.env.DB, true) }));

projectRoutes.post('/', async (context) => {
  const parsed = projectSchema.safeParse(await context.req.json().catch(() => null));
  if (!parsed.success) return invalid(context, parsed.error.flatten());

  const result = await context.env.DB.prepare(`
    INSERT INTO projects (
      slug, title_tr, title_en, summary_tr, summary_en, description_tr, description_en,
      image_url, live_url, source_url, technologies, sort_order, featured, published
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(...values(parsed.data)).run();
  return context.json({ id: result.meta.last_row_id }, 201);
});

projectRoutes.put('/order', async (context) => {
  const parsed = orderSchema.safeParse(await context.req.json().catch(() => null));
  if (!parsed.success) return invalid(context, parsed.error.flatten());
  await context.env.DB.batch(
    parsed.data.items.map(({ id, sort_order }) =>
      context.env.DB.prepare('UPDATE projects SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(sort_order, id),
    ),
  );
  return context.json({ updated: parsed.data.items.length });
});

projectRoutes.put('/:id', async (context) => {
  const id = Number(context.req.param('id'));
  const parsed = projectSchema.safeParse(await context.req.json().catch(() => null));
  if (!Number.isInteger(id) || id < 1 || !parsed.success) return invalid(context, parsed.success ? {} : parsed.error.flatten());

  const result = await context.env.DB.prepare(`
    UPDATE projects SET
      slug = ?, title_tr = ?, title_en = ?, summary_tr = ?, summary_en = ?,
      description_tr = ?, description_en = ?, image_url = ?, live_url = ?, source_url = ?,
      technologies = ?, sort_order = ?, featured = ?, published = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(...values(parsed.data), id).run();
  return result.meta.changes
    ? context.json({ id })
    : context.json({ error: 'not_found', message: 'Project not found.' }, 404);
});

projectRoutes.delete('/:id', async (context) => {
  const id = Number(context.req.param('id'));
  if (!Number.isInteger(id) || id < 1) return invalid(context, {});
  const result = await context.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  return result.meta.changes
    ? context.json({ deleted: id })
    : context.json({ error: 'not_found', message: 'Project not found.' }, 404);
});
