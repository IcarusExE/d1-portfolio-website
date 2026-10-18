import '../styles.css';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  createIcons,
  ExternalLink,
  Folders,
  LogIn,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Save,
  Settings2,
  Trash2,
  Wrench,
  X,
} from 'lucide';
import { api } from '../shared/api.js';

const icons = { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, Folders, LogIn, LogOut, Menu, Pencil, Plus, Save, Settings2, Trash2, Wrench, X };
const state = { projects: [], skills: [], settings: {} };
const loginView = document.querySelector('#login-view');
const adminView = document.querySelector('#admin-view');
const projectDialog = document.querySelector('#project-dialog');
const skillDialog = document.querySelector('#skill-dialog');

function refreshIcons(root = document) {
  createIcons({ icons, attrs: { 'aria-hidden': 'true' }, root });
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 2800);
}

function actionButton(icon, label, action, id) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-button';
  button.title = label;
  button.setAttribute('aria-label', label);
  button.dataset.action = action;
  button.dataset.id = id;
  const iconNode = document.createElement('i');
  iconNode.dataset.lucide = icon;
  button.append(iconNode);
  return button;
}

async function loadAdminData() {
  const [settings, projects, skills] = await Promise.all([
    api('/api/admin/settings'),
    api('/api/admin/projects'),
    api('/api/admin/skills'),
  ]);
  state.settings = settings.settings;
  state.projects = projects.projects;
  state.skills = skills.skills;
  renderSettings();
  renderProjects();
  renderSkills();
}

function renderSettings() {
  const form = document.querySelector('#settings-form');
  Object.entries(state.settings).forEach(([key, value]) => {
    if (form.elements.namedItem(key)) form.elements.namedItem(key).value = value;
  });
}

function renderProjects() {
  const container = document.querySelector('#admin-projects');
  container.replaceChildren();
  if (!state.projects.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Henüz proje yok. İlk projeni ekleyerek başla.';
    container.append(empty);
    return;
  }

  state.projects.forEach((project, index) => {
    const row = document.createElement('article');
    row.className = 'resource-row';
    const main = document.createElement('div');
    main.className = 'resource-main';
    const title = document.createElement('strong');
    title.textContent = project.title_tr;
    const meta = document.createElement('span');
    const dot = document.createElement('i');
    dot.className = `status-dot${project.published ? ' live' : ''}`;
    meta.append(dot, document.createTextNode(`${project.published ? 'Yayında' : 'Taslak'} · ${project.slug}`));
    main.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'resource-actions';
    const up = actionButton('arrow-up', 'Yukarı taşı', 'project-up', project.id);
    up.disabled = index === 0;
    const down = actionButton('arrow-down', 'Aşağı taşı', 'project-down', project.id);
    down.disabled = index === state.projects.length - 1;
    actions.append(up, down, actionButton('pencil', 'Düzenle', 'project-edit', project.id), actionButton('trash-2', 'Sil', 'project-delete', project.id));
    row.append(main, actions);
    container.append(row);
  });
  refreshIcons(container);
}

function renderSkills() {
  const container = document.querySelector('#admin-skills');
  container.replaceChildren();
  if (!state.skills.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Henüz yetenek yok. İlk yeteneğini ekleyerek başla.';
    container.append(empty);
    return;
  }

  state.skills.forEach((skill) => {
    const row = document.createElement('article');
    row.className = 'resource-row';
    const main = document.createElement('div');
    main.className = 'resource-main';
    const title = document.createElement('strong');
    title.textContent = skill.name;
    const meta = document.createElement('span');
    const dot = document.createElement('i');
    dot.className = `status-dot${skill.published ? ' live' : ''}`;
    meta.append(dot, document.createTextNode(`${skill.category_tr || 'Kategorisiz'} · Seviye ${skill.level}`));
    main.append(title, meta);
    const actions = document.createElement('div');
    actions.className = 'resource-actions';
    actions.append(actionButton('pencil', 'Düzenle', 'skill-edit', skill.id), actionButton('trash-2', 'Sil', 'skill-delete', skill.id));
    row.append(main, actions);
    container.append(row);
  });
  refreshIcons(container);
}

function populateForm(form, resource) {
  form.reset();
  Object.entries(resource || {}).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (!field) return;
    if (field.type === 'checkbox') field.checked = Boolean(value);
    else if (Array.isArray(value)) field.value = value.join(', ');
    else field.value = value ?? '';
  });
}

function projectPayload(form) {
  const data = new FormData(form);
  return {
    slug: data.get('slug').trim(),
    title_tr: data.get('title_tr').trim(),
    title_en: data.get('title_en').trim(),
    summary_tr: data.get('summary_tr').trim(),
    summary_en: data.get('summary_en').trim(),
    description_tr: data.get('description_tr').trim(),
    description_en: data.get('description_en').trim(),
    image_url: data.get('image_url').trim(),
    live_url: data.get('live_url').trim(),
    source_url: data.get('source_url').trim(),
    technologies: data.get('technologies').split(',').map((item) => item.trim()).filter(Boolean),
    sort_order: Number(data.get('sort_order')),
    featured: data.get('featured') === 'on',
    published: data.get('published') === 'on',
  };
}

function skillPayload(form) {
  const data = new FormData(form);
  return {
    name: data.get('name').trim(),
    category_tr: data.get('category_tr').trim(),
    category_en: data.get('category_en').trim(),
    level: Number(data.get('level')),
    sort_order: Number(data.get('sort_order')),
    published: data.get('published') === 'on',
  };
}

async function saveProjectOrder() {
  await api('/api/admin/projects/order', {
    method: 'PUT',
    body: JSON.stringify({ items: state.projects.map((project, index) => ({ id: project.id, sort_order: (index + 1) * 10 })) }),
  });
  state.projects.forEach((project, index) => { project.sort_order = (index + 1) * 10; });
  renderProjects();
  showToast('Proje sırası güncellendi.');
}

document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.querySelector('#login-error');
  const button = form.querySelector('button[type="submit"]');
  error.textContent = '';
  button.disabled = true;
  try {
    const data = new FormData(form);
    const session = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: data.get('username'), password: data.get('password') }),
    });
    document.querySelector('#admin-username').textContent = session.username;
    loginView.hidden = true;
    adminView.hidden = false;
    await loadAdminData();
  } catch (requestError) {
    error.textContent = requestError.status === 429
      ? 'Çok fazla deneme yapıldı. Kısa bir süre sonra tekrar dene.'
      : 'Kullanıcı adı veya parola hatalı.';
  } finally {
    button.disabled = false;
  }
});

document.querySelector('#logout-button').addEventListener('click', async () => {
  await api('/api/auth/logout', { method: 'POST' });
  adminView.hidden = true;
  loginView.hidden = false;
  document.querySelector('#login-form').reset();
});

document.querySelectorAll('.admin-nav[data-panel]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.admin-nav[data-panel]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('[data-panel-view]').forEach((panel) => { panel.hidden = panel.dataset.panelView !== button.dataset.panel; });
    document.querySelector('.admin-sidebar').classList.remove('open');
  });
});

document.querySelector('#menu-button').addEventListener('click', () => document.querySelector('.admin-sidebar').classList.toggle('open'));

document.querySelector('#settings-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#settings-status');
  const settings = Object.fromEntries(new FormData(form).entries());
  status.textContent = 'Kaydediliyor...';
  try {
    const response = await api('/api/admin/settings', { method: 'PUT', body: JSON.stringify({ settings }) });
    state.settings = response.settings;
    status.textContent = 'Değişiklikler kaydedildi.';
    showToast('Site ayarları güncellendi.');
  } catch {
    status.textContent = 'Kaydetme başarısız. Alanları kontrol et.';
  }
});

document.querySelector('#add-project').addEventListener('click', () => {
  populateForm(document.querySelector('#project-form'), { sort_order: (state.projects.length + 1) * 10, published: true });
  document.querySelector('#project-dialog-title').textContent = 'Yeni proje';
  document.querySelector('#project-error').textContent = '';
  projectDialog.showModal();
});

document.querySelector('#add-skill').addEventListener('click', () => {
  populateForm(document.querySelector('#skill-form'), { sort_order: (state.skills.length + 1) * 10, published: true, level: 0 });
  document.querySelector('#skill-dialog-title').textContent = 'Yeni yetenek';
  document.querySelector('#skill-error').textContent = '';
  skillDialog.showModal();
});

document.querySelector('#project-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const id = form.elements.id.value;
  const error = document.querySelector('#project-error');
  error.textContent = '';
  try {
    await api(id ? `/api/admin/projects/${id}` : '/api/admin/projects', {
      method: id ? 'PUT' : 'POST', body: JSON.stringify(projectPayload(form)),
    });
    state.projects = (await api('/api/admin/projects')).projects;
    renderProjects();
    projectDialog.close();
    showToast(id ? 'Proje güncellendi.' : 'Proje eklendi.');
  } catch (requestError) {
    error.textContent = requestError.status === 400 ? 'Zorunlu alanları ve URL biçimlerini kontrol et.' : 'Proje kaydedilemedi.';
  }
});

document.querySelector('#skill-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const id = form.elements.id.value;
  const error = document.querySelector('#skill-error');
  error.textContent = '';
  try {
    await api(id ? `/api/admin/skills/${id}` : '/api/admin/skills', {
      method: id ? 'PUT' : 'POST', body: JSON.stringify(skillPayload(form)),
    });
    state.skills = (await api('/api/admin/skills')).skills;
    renderSkills();
    skillDialog.close();
    showToast(id ? 'Yetenek güncellendi.' : 'Yetenek eklendi.');
  } catch (requestError) {
    error.textContent = requestError.status === 400 ? 'Alanları kontrol et.' : 'Yetenek kaydedilemedi.';
  }
});

document.querySelector('#admin-projects').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = Number(button.dataset.id);
  const index = state.projects.findIndex((project) => project.id === id);
  if (button.dataset.action === 'project-edit') {
    populateForm(document.querySelector('#project-form'), state.projects[index]);
    document.querySelector('#project-dialog-title').textContent = 'Projeyi düzenle';
    document.querySelector('#project-error').textContent = '';
    projectDialog.showModal();
  } else if (button.dataset.action === 'project-delete' && window.confirm('Bu proje kalıcı olarak silinsin mi?')) {
    await api(`/api/admin/projects/${id}`, { method: 'DELETE' });
    state.projects.splice(index, 1);
    renderProjects();
    showToast('Proje silindi.');
  } else if (button.dataset.action === 'project-up' && index > 0) {
    [state.projects[index - 1], state.projects[index]] = [state.projects[index], state.projects[index - 1]];
    await saveProjectOrder();
  } else if (button.dataset.action === 'project-down' && index < state.projects.length - 1) {
    [state.projects[index + 1], state.projects[index]] = [state.projects[index], state.projects[index + 1]];
    await saveProjectOrder();
  }
});

document.querySelector('#admin-skills').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = Number(button.dataset.id);
  const index = state.skills.findIndex((skill) => skill.id === id);
  if (button.dataset.action === 'skill-edit') {
    populateForm(document.querySelector('#skill-form'), state.skills[index]);
    document.querySelector('#skill-dialog-title').textContent = 'Yeteneği düzenle';
    document.querySelector('#skill-error').textContent = '';
    skillDialog.showModal();
  } else if (button.dataset.action === 'skill-delete' && window.confirm('Bu yetenek kalıcı olarak silinsin mi?')) {
    await api(`/api/admin/skills/${id}`, { method: 'DELETE' });
    state.skills.splice(index, 1);
    renderSkills();
    showToast('Yetenek silindi.');
  }
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => document.querySelector(`#${button.dataset.closeDialog}`).close());
});

refreshIcons();

try {
  const session = await api('/api/auth/session');
  document.querySelector('#admin-username').textContent = session.username;
  loginView.hidden = true;
  adminView.hidden = false;
  await loadAdminData();
} catch {
  loginView.hidden = false;
  adminView.hidden = true;
}
