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

const dictionary = {
  tr: {
    skip: 'İçeriğe geç', projects: 'Projeler', skills: 'Yetenekler', contact: 'İletişim',
    available: 'Yeni projelere açık', viewWork: 'Çalışmalarımı incele', basedIn: 'Konum',
    education: 'Eğitim', university: 'Ankara Üniversitesi', focus: 'Odak',
    focusValue: 'Web ürünleri ve backend', currentBuild: 'Şu an geliştirdiğim', active: 'Aktif',
    systemNote: 'Uçtan uca, yönetilebilir web ürünleri', universityProgram: 'Ankara Üniversitesi · Bilgisayar Programcılığı',
    development: 'Geliştirme durumu', shipping: 'Aktif olarak ürün geliştiriyor', selectedWork: 'Seçili çalışmalar',
    projectsIntro: 'Öğrenirken geliştirdiğim ve kullanılabilir hale getirdiğim projeler.',
    loading: 'İçerik yükleniyor...', toolkit: 'Çalışma araçlarım',
    skillsIntro: 'Bir fikri çalışan ürüne dönüştürmek için kullandığım teknolojiler.',
    about: 'Hakkımda', approachLabel: 'Yaklaşım', clarityTitle: 'Önce netlik',
    clarityCopy: 'Karmaşıklığı sade, anlaşılır akışlara dönüştürüyorum.', qualityTitle: 'Ölçülebilir kalite',
    qualityCopy: 'Performans, erişilebilirlik ve güvenliği birlikte ele alıyorum.', buildTogether: 'Birlikte bir şey geliştirelim.',
    contactCopy: 'Bir proje fikrini, staj fırsatını veya teknik bir konuyu konuşmak için ulaşabilirsin.',
    backTop: 'Başa dön', emptyProjects: 'Henüz yayınlanmış proje yok. Yeni çalışmalar yakında burada olacak.',
    emptySkills: 'Yetenek listesi yakında güncellenecek.', live: 'Canlı projeyi aç', source: 'Kaynak kodunu aç',
    loadError: 'İçerik şu anda yüklenemedi. Lütfen biraz sonra tekrar dene.',
  },
  en: {
    skip: 'Skip to content', projects: 'Projects', skills: 'Skills', contact: 'Contact',
    available: 'Open to new projects', viewWork: 'Explore my work', basedIn: 'Based in',
    education: 'Education', university: 'Ankara University', focus: 'Focus',
    focusValue: 'Web products and backend', currentBuild: 'Currently building', active: 'Active',
    systemNote: 'End-to-end, manageable web products', universityProgram: 'Ankara University · Computer Programming',
    development: 'Development status', shipping: 'Actively building products', selectedWork: 'Selected work',
    projectsIntro: 'Projects I have built and shaped into usable products while learning.',
    loading: 'Loading content...', toolkit: 'My toolkit',
    skillsIntro: 'Technologies I use to turn an idea into a working product.',
    about: 'About me', approachLabel: 'Approach', clarityTitle: 'Clarity first',
    clarityCopy: 'I turn complexity into simple, understandable flows.', qualityTitle: 'Measurable quality',
    qualityCopy: 'I treat performance, accessibility and security as one system.', buildTogether: 'Let’s build something together.',
    contactCopy: 'Reach out to discuss a project idea, an internship opportunity or a technical topic.',
    backTop: 'Back to top', emptyProjects: 'No published projects yet. New work will appear here soon.',
    emptySkills: 'The skills list will be updated soon.', live: 'Open live project', source: 'Open source code',
    loadError: 'Content could not be loaded right now. Please try again shortly.',
  },
};

const iconSet = {
  Activity, ArrowDownRight, ArrowUp, ArrowUpRight, BriefcaseBusiness, Cloud, Code2,
  Database, ExternalLink, Gauge, GraduationCap, LayoutTemplate, Mail, MapPin, ScanLine, ShieldCheck,
};
let content = {
  settings: {
    name: 'Kenan Kuşçu',
    title_tr: 'Yazılım Geliştirici ve Bilgisayar Programcılığı Öğrencisi',
    title_en: 'Software Developer and Computer Programming Student',
    hero_tr: 'Fikirleri anlaşılır, hızlı ve sağlam dijital ürünlere dönüştürüyorum.',
    hero_en: 'I turn ideas into clear, fast and reliable digital products.',
    about_tr: 'Ankara Üniversitesi Bilgisayar Programcılığı öğrencisiyim. Öğrenirken üreten, kullanılabilir web deneyimleri geliştiren bir yazılım geliştiriciyim.',
    about_en: 'I study Computer Programming at Ankara University. I am a software developer who learns by building useful web experiences.',
    email: '', github_url: 'https://github.com/icarusexe', linkedin_url: '',
  },
  projects: [],
  skills: [],
};
let language = localStorage.getItem('portfolio-language') || (navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en');

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
    empty.textContent = dictionary[language].emptyProjects;
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
      image.alt = `${project[`title_${language}`]} ekran görüntüsü`;
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
    title.textContent = project[`title_${language}`];
    const summary = document.createElement('p');
    summary.textContent = project[`summary_${language}`];
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
    if (project.live_url) links.append(iconLink(project.live_url, dictionary[language].live, 'external-link'));
    if (project.source_url) links.append(iconLink(project.source_url, dictionary[language].source, 'code-2'));
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
    empty.textContent = dictionary[language].emptySkills;
    container.append(empty);
    return;
  }

  content.skills.forEach((skill) => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    const name = document.createElement('strong');
    name.textContent = skill.name;
    const category = document.createElement('span');
    category.textContent = skill[`category_${language}`];
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
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = dictionary[language][element.dataset.i18n];
  });
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });

  const { settings } = content;
  document.title = `${settings.name} | ${settings[`title_${language}`]}`;
  document.querySelector('#hero-name').textContent = settings.name;
  document.querySelector('#hero-title').textContent = settings[`title_${language}`];
  document.querySelector('#hero-statement').textContent = settings[`hero_${language}`];
  document.querySelector('#about-copy').textContent = settings[`about_${language}`];
  renderProjects();
  renderSkills();
  renderContacts();
  createIcons({ icons: iconSet });
}

document.querySelectorAll('[data-language]').forEach((button) => {
  button.addEventListener('click', () => {
    language = button.dataset.language;
    localStorage.setItem('portfolio-language', language);
    render();
  });
});

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
  error.textContent = dictionary[language].loadError;
  container.append(error);
}
