PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_tr TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  description_tr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
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
  category_tr TEXT NOT NULL DEFAULT '',
  category_en TEXT NOT NULL DEFAULT '',
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
  ('title_tr', 'Yazılım Geliştirici ve Bilgisayar Programcılığı Öğrencisi', 'text'),
  ('title_en', 'Software Developer and Computer Programming Student', 'text'),
  ('hero_tr', 'Fikirleri anlaşılır, hızlı ve sağlam dijital ürünlere dönüştürüyorum.', 'text'),
  ('hero_en', 'I turn ideas into clear, fast and reliable digital products.', 'text'),
  ('about_tr', 'Ankara Üniversitesi Bilgisayar Programcılığı öğrencisiyim. Öğrenirken üreten, kullanılabilir web deneyimleri geliştiren bir yazılım geliştiriciyim.', 'text'),
  ('about_en', 'I study Computer Programming at Ankara University. I am a software developer who learns by building useful web experiences.', 'text'),
  ('email', '', 'email'),
  ('github_url', 'https://github.com/icarusexe', 'url'),
  ('linkedin_url', '', 'url');

INSERT OR IGNORE INTO skills (name, category_tr, category_en, level, sort_order) VALUES
  ('JavaScript', 'Web geliştirme', 'Web development', 75, 10),
  ('HTML & CSS', 'Arayüz', 'Interface', 80, 20),
  ('Cloudflare Workers', 'Backend', 'Backend', 60, 30),
  ('SQLite / D1', 'Veritabanı', 'Database', 60, 40);

INSERT INTO projects (
  slug, title_tr, title_en, summary_tr, summary_en, description_tr, description_en,
  image_url, live_url, source_url, technologies, sort_order, featured, published
)
SELECT
  'cloudflare-d1-hono-api',
  'Cloudflare D1 & Hono API',
  'Cloudflare D1 & Hono API',
  'D1 üzerinde çalışan, kimlik doğrulamalı ve doğrulanmış CRUD uçlarına sahip edge-native API katmanı.',
  'An edge-native API layer on D1 with authentication, validation and complete CRUD endpoints.',
  'Portfolyo içeriğini yöneten; güvenli oturum, hız sınırlama ve parametreli D1 sorguları kullanan backend altyapısı.',
  'The backend behind the portfolio, built with secure sessions, rate limiting and parameterized D1 queries.',
  '',
  'https://d1-portfolio-website.kenankuscu.workers.dev/api/health',
  'https://github.com/IcarusExE/d1-portfolio-website',
  '["Cloudflare Workers","Hono","D1","Zod"]',
  10, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = 'cloudflare-d1-hono-api');

INSERT INTO projects (
  slug, title_tr, title_en, summary_tr, summary_en, description_tr, description_en,
  image_url, live_url, source_url, technologies, sort_order, featured, published
)
SELECT
  'full-stack-portfolio-platform',
  'Full-Stack Web Uygulaması',
  'Full-Stack Web Application',
  'İki dilli ziyaretçi deneyimi, güvenli admin paneli ve anlık içerik yönetimini tek yapıda birleştiren platform.',
  'A platform combining a bilingual visitor experience, secure admin panel and live content management.',
  'Vanilla JavaScript ve Tailwind ile geliştirilen; Cloudflare üzerinde uçtan uca yayınlanan responsive web uygulaması.',
  'A responsive Vanilla JavaScript and Tailwind application deployed end-to-end on Cloudflare.',
  '',
  'https://d1-portfolio-website.kenankuscu.workers.dev',
  'https://github.com/IcarusExE/d1-portfolio-website',
  '["Vanilla JS","Tailwind CSS","Vite","Playwright"]',
  20, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = 'full-stack-portfolio-platform');

INSERT INTO skills (name, category_tr, category_en, level, sort_order)
SELECT 'Git & GitHub', 'Geliştirme akışı', 'Development workflow', 72, 50
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Git & GitHub');

INSERT INTO skills (name, category_tr, category_en, level, sort_order)
SELECT 'REST API', 'Backend', 'Backend', 70, 60
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'REST API');

INSERT INTO skills (name, category_tr, category_en, level, sort_order)
SELECT 'Responsive UI', 'Arayüz', 'Interface', 78, 70
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Responsive UI');
