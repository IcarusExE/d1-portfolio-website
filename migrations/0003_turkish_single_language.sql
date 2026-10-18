-- Preserve Turkish content while removing the secondary-language schema.
CREATE TABLE projects_single_language (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  live_url TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  technologies TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(technologies)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects_single_language (
  id, slug, title, summary, description, image_url, live_url, source_url,
  technologies, sort_order, featured, published, created_at, updated_at
)
SELECT
  id, slug, title_tr, summary_tr, description_tr, image_url, live_url, source_url,
  technologies, sort_order, featured, published, created_at, updated_at
FROM projects;

DROP TABLE projects;
ALTER TABLE projects_single_language RENAME TO projects;
CREATE INDEX idx_projects_published_order ON projects (published, sort_order, created_at);

CREATE TABLE skills_single_language (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  level INTEGER NOT NULL DEFAULT 0 CHECK (level BETWEEN 0 AND 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO skills_single_language (
  id, name, category, level, sort_order, published, created_at, updated_at
)
SELECT id, name, category_tr, level, sort_order, published, created_at, updated_at
FROM skills;

DROP TABLE skills;
ALTER TABLE skills_single_language RENAME TO skills;
CREATE INDEX idx_skills_published_order ON skills (published, sort_order, name);

INSERT INTO site_settings (key, value, value_type, updated_at)
SELECT 'title', value, value_type, updated_at FROM site_settings WHERE key = 'title_tr'
ON CONFLICT(key) DO UPDATE SET value = excluded.value, value_type = excluded.value_type, updated_at = excluded.updated_at;

INSERT INTO site_settings (key, value, value_type, updated_at)
SELECT 'hero', value, value_type, updated_at FROM site_settings WHERE key = 'hero_tr'
ON CONFLICT(key) DO UPDATE SET value = excluded.value, value_type = excluded.value_type, updated_at = excluded.updated_at;

INSERT INTO site_settings (key, value, value_type, updated_at)
SELECT 'about', value, value_type, updated_at FROM site_settings WHERE key = 'about_tr'
ON CONFLICT(key) DO UPDATE SET value = excluded.value, value_type = excluded.value_type, updated_at = excluded.updated_at;

DELETE FROM site_settings
WHERE key IN ('title_tr', 'title_en', 'hero_tr', 'hero_en', 'about_tr', 'about_en');

UPDATE projects
SET summary = 'Ziyaretçi deneyimi, güvenli admin paneli ve anlık içerik yönetimini tek yapıda birleştiren platform.'
WHERE slug = 'full-stack-portfolio-platform'
  AND summary LIKE 'İki dilli%';
