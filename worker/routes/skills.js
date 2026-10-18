import { Hono } from 'hono';
import { z } from 'zod';
import { listSkills } from '../repositories/content.js';

const skillSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.string().trim().max(80).default(''),
  level: z.coerce.number().int().min(0).max(100).default(0),
  sort_order: z.coerce.number().int().min(0).max(10000).default(0),
  published: z.boolean().default(true),
});

function invalid(context, issues) {
  return context.json({ error: 'validation_error', message: 'Check the submitted fields.', issues }, 400);
}

export const skillRoutes = new Hono();

skillRoutes.get('/', async (context) => context.json({ skills: await listSkills(context.env.DB, true) }));

skillRoutes.post('/', async (context) => {
  const parsed = skillSchema.safeParse(await context.req.json().catch(() => null));
  if (!parsed.success) return invalid(context, parsed.error.flatten());
  const skill = parsed.data;
  const result = await context.env.DB.prepare(`
    INSERT INTO skills (name, category, level, sort_order, published)
    VALUES (?, ?, ?, ?, ?)
  `).bind(skill.name, skill.category, skill.level, skill.sort_order, Number(skill.published)).run();
  return context.json({ id: result.meta.last_row_id }, 201);
});

skillRoutes.put('/:id', async (context) => {
  const id = Number(context.req.param('id'));
  const parsed = skillSchema.safeParse(await context.req.json().catch(() => null));
  if (!Number.isInteger(id) || id < 1 || !parsed.success) return invalid(context, parsed.success ? {} : parsed.error.flatten());
  const skill = parsed.data;
  const result = await context.env.DB.prepare(`
    UPDATE skills SET name = ?, category = ?, level = ?, sort_order = ?,
      published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(skill.name, skill.category, skill.level, skill.sort_order, Number(skill.published), id).run();
  return result.meta.changes
    ? context.json({ id })
    : context.json({ error: 'not_found', message: 'Skill not found.' }, 404);
});

skillRoutes.delete('/:id', async (context) => {
  const id = Number(context.req.param('id'));
  if (!Number.isInteger(id) || id < 1) return invalid(context, {});
  const result = await context.env.DB.prepare('DELETE FROM skills WHERE id = ?').bind(id).run();
  return result.meta.changes
    ? context.json({ deleted: id })
    : context.json({ error: 'not_found', message: 'Skill not found.' }, 404);
});
