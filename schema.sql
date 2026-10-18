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
