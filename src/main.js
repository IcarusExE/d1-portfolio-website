import './styles.css';
import './portfolio.css';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  ArrowUp,
  BriefcaseBusiness,
  Cloud,
  Code2,
  createIcons,
  Database,
  ExternalLink,
  Gauge,
  GraduationCap,
  LayoutTemplate,
  Mail,
  MapPin,
  ScanLine,
  ShieldCheck,
} from 'lucide';
import { api } from './shared/api.js';

const iconSet = {
  Activity, ArrowDownRight, ArrowUp, ArrowUpRight, BriefcaseBusiness, Cloud, Code2,
  Database, ExternalLink, Gauge, GraduationCap, LayoutTemplate, Mail, MapPin, ScanLine, ShieldCheck,
};
let content = {
  settings: {
    name: 'Kenan Kuşçu',
    title: 'Yazılım Geliştirici ve Bilgisayar Programcılığı Öğrencisi',
    hero: 'Fikirleri anlaşılır, hızlı ve sağlam dijital ürünlere dönüştürüyorum.',
    about: 'Ankara Üniversitesi Bilgisayar Programcılığı öğrencisiyim. Öğrenirken üreten, kullanılabilir web deneyimleri geliştiren bir yazılım geliştiriciyim.',
    email: '', github_url: 'https://github.com/icarusexe', linkedin_url: '',
  },
  projects: [],
  skills: [],
};

function iconLink(url, label, icon) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'icon-link';
  link.setAttribute('aria-label', label);
  link.title = label;
  const node = document.createElement('i');
  node.dataset.lucide = icon;
  link.append(node);
  return link;
}

function renderProjects() {
  const container = document.querySelector('#project-list');
  container.replaceChildren();
  if (!content.projects.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Henüz yayınlanmış proje yok. Yeni çalışmalar yakında burada olacak.';
    container.append(empty);
    return;
  }

  content.projects.forEach((project, index) => {
    const article = document.createElement('article');
    article.className = 'project-item';

    const number = document.createElement('span');
    number.className = 'project-index';
    number.textContent = String(index + 1).padStart(2, '0');

    const visual = document.createElement('div');
    visual.className = 'project-visual';
    if (project.image_url) {
      const image = document.createElement('img');
      image.src = project.image_url;
      image.alt = `${project.title} ekran görüntüsü`;
      image.loading = 'lazy';
      visual.append(image);
    } else {
      visual.classList.add('project-artifact', `artifact-${index % 2 === 0 ? 'api' : 'app'}`);
      const chrome = document.createElement('div');
      chrome.className = 'artifact-chrome';
      chrome.innerHTML = '<span></span><span></span><span></span>';
      const label = document.createElement('strong');
      label.textContent = index % 2 === 0 ? 'api.kenan.dev' : 'app.kenan.dev';
      chrome.append(label);
      const body = document.createElement('div');
      body.className = 'artifact-body';
      if (index % 2 === 0) {
        body.innerHTML = '<span class="artifact-route"><b>GET</b> /api/public <i>200</i></span><span class="artifact-route"><b>POST</b> /api/projects <i>201</i></span><span class="artifact-route"><b>PUT</b> /api/settings <i>200</i></span>';
      } else {
        body.innerHTML = '<span class="artifact-sidebar"></span><span class="artifact-panel"><i></i><i></i><i></i></span><span class="artifact-mini"></span>';
      }
      visual.append(chrome, body);
    }

    const copy = document.createElement('div');
    copy.className = 'project-copy';
    const title = document.createElement('h3');
    title.textContent = project.title;
    const summary = document.createElement('p');
    summary.textContent = project.summary;
    const technologies = document.createElement('div');
    technologies.className = 'tech-list';
    project.technologies.forEach((technology) => {
      const tag = document.createElement('span');
      tag.textContent = technology;
      technologies.append(tag);
    });
    copy.append(title, summary, technologies);

    const links = document.createElement('div');
    links.className = 'project-links';
    if (project.live_url) links.append(iconLink(project.live_url, 'Canlı projeyi aç', 'external-link'));
    if (project.source_url) links.append(iconLink(project.source_url, 'Kaynak kodunu aç', 'code-2'));
    article.append(number, visual, copy, links);
    container.append(article);
  });
}

function renderSkills() {
  const container = document.querySelector('#skills-list');
  container.replaceChildren();
  if (!content.skills.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Yetenek listesi yakında güncellenecek.';
    container.append(empty);
    return;
  }

  content.skills.forEach((skill) => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    const name = document.createElement('strong');
    name.textContent = skill.name;
    const category = document.createElement('span');
    category.textContent = skill.category;
    const level = document.createElement('div');
    level.className = 'skill-level';
    level.setAttribute('aria-label', `${skill.level}%`);
    const fill = document.createElement('i');
    fill.style.width = `${skill.level}%`;
    level.append(fill);
    row.append(name, category, level);
    container.append(row);
  });
}

function renderContacts() {
  const settings = content.settings;
  const container = document.querySelector('#contact-links');
  container.replaceChildren();
  const contacts = [
    [settings.email ? `mailto:${settings.email}` : '', 'E-posta', 'mail'],
    [settings.github_url, 'GitHub', 'code-2'],
    [settings.linkedin_url, 'LinkedIn', 'briefcase-business'],
  ];
  contacts.filter(([url]) => url).forEach(([url, label, icon]) => {
    const link = iconLink(url, label, icon);
    link.className = '';
    const text = document.createElement('span');
    text.textContent = label;
    link.append(text);
    container.append(link);
  });
}

function render() {
  const { settings } = content;
  document.title = `${settings.name} | ${settings.title}`;
  document.querySelector('#hero-name').textContent = settings.name;
  document.querySelector('#hero-title').textContent = settings.title;
  document.querySelector('#hero-statement').textContent = settings.hero;
  document.querySelector('#about-copy').textContent = settings.about;
  renderProjects();
  renderSkills();
  renderContacts();
  createIcons({ icons: iconSet });
}

document.querySelector('#year').textContent = new Date().getFullYear();
render();

try {
  content = await api('/api/public');
  render();
} catch {
  const container = document.querySelector('#project-list');
  container.innerHTML = '';
  const error = document.createElement('p');
  error.className = 'empty-state';
  error.textContent = 'İçerik şu anda yüklenemedi. Lütfen biraz sonra tekrar dene.';
  container.append(error);
}
