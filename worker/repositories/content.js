function parseProject(row) {
  return {
    ...row,
    technologies: JSON.parse(row.technologies || '[]'),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
  };
}

export async function listProjects(database, includeDrafts = false) {
  const where = includeDrafts ? '' : 'WHERE published = 1';
  const { results } = await database
    .prepare(`SELECT * FROM projects ${where} ORDER BY sort_order ASC, created_at DESC`)
    .all();
  return results.map(parseProject);
}

export async function listSkills(database, includeDrafts = false) {
  const where = includeDrafts ? '' : 'WHERE published = 1';
  const { results } = await database
    .prepare(`SELECT * FROM skills ${where} ORDER BY sort_order ASC, name ASC`)
    .all();
  return results.map((row) => ({ ...row, published: Boolean(row.published) }));
}

export async function getSettings(database) {
  const { results } = await database.prepare('SELECT key, value, value_type FROM site_settings ORDER BY key').all();
  return Object.fromEntries(results.map(({ key, value }) => [key, value]));
}

export async function getPublicContent(database) {
  const [settings, projects, skills] = await Promise.all([
    getSettings(database),
    listProjects(database),
    listSkills(database),
  ]);
  return { settings, projects, skills };
}
