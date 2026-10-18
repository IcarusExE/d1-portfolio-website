PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
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

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  level INTEGER NOT NULL DEFAULT 0 CHECK (level BETWEEN 0 AND 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  value_type TEXT NOT NULL DEFAULT 'text' CHECK (value_type IN ('text', 'url', 'email', 'json')),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_published_order
  ON projects (published, sort_order, created_at);
CREATE INDEX IF NOT EXISTS idx_skills_published_order
  ON skills (published, sort_order, name);

INSERT OR IGNORE INTO site_settings (key, value, value_type) VALUES
  ('name', 'Kenan Kuşçu', 'text'),
  ('title', 'Yazılım Geliştirici ve Bilgisayar Programcılığı Öğrencisi', 'text'),
  ('hero', 'Fikirleri anlaşılır, hızlı ve sağlam dijital ürünlere dönüştürüyorum.', 'text'),
  ('about', 'Ankara Üniversitesi Bilgisayar Programcılığı öğrencisiyim. Öğrenirken üreten, kullanılabilir web deneyimleri geliştiren bir yazılım geliştiriciyim.', 'text'),
  ('email', '', 'email'),
  ('github_url', 'https://github.com/icarusexe', 'url'),
  ('linkedin_url', '', 'url');

INSERT OR IGNORE INTO skills (name, category, level, sort_order) VALUES
  ('JavaScript', 'Web geliştirme', 75, 10),
  ('HTML & CSS', 'Arayüz', 80, 20),
  ('Cloudflare Workers', 'Backend', 60, 30),
  ('SQLite / D1', 'Veritabanı', 60, 40);

INSERT INTO projects (
  slug, title, summary, description,
  image_url, live_url, source_url, technologies, sort_order, featured, published
)
SELECT
  'cloudflare-d1-hono-api',
  'Cloudflare D1 & Hono API',
  'D1 üzerinde çalışan, kimlik doğrulamalı ve doğrulanmış CRUD uçlarına sahip edge-native API katmanı.',
  'Portfolyo içeriğini yöneten; güvenli oturum, hız sınırlama ve parametreli D1 sorguları kullanan backend altyapısı.',
  '',
  'https://d1-portfolio-website.kenankuscu.workers.dev/api/health',
  'https://github.com/IcarusExE/d1-portfolio-website',
  '["Cloudflare Workers","Hono","D1","Zod"]',
  10, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = 'cloudflare-d1-hono-api');

INSERT INTO projects (
  slug, title, summary, description,
  image_url, live_url, source_url, technologies, sort_order, featured, published
)
SELECT
  'full-stack-portfolio-platform',
  'Full-Stack Web Uygulaması',
  'Ziyaretçi deneyimi, güvenli admin paneli ve anlık içerik yönetimini tek yapıda birleştiren platform.',
  'Vanilla JavaScript ve Tailwind ile geliştirilen; Cloudflare üzerinde uçtan uca yayınlanan responsive web uygulaması.',
  '',
  'https://d1-portfolio-website.kenankuscu.workers.dev',
  'https://github.com/IcarusExE/d1-portfolio-website',
  '["Vanilla JS","Tailwind CSS","Vite","Playwright"]',
  20, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = 'full-stack-portfolio-platform');

INSERT INTO skills (name, category, level, sort_order)
SELECT 'Git & GitHub', 'Geliştirme akışı', 72, 50
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Git & GitHub');

INSERT INTO skills (name, category, level, sort_order)
SELECT 'REST API', 'Backend', 70, 60
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'REST API');

INSERT INTO skills (name, category, level, sort_order)
SELECT 'Responsive UI', 'Arayüz', 78, 70
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Responsive UI');
