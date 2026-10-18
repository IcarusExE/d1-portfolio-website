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
