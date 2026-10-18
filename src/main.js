import './styles.css';
import './portfolio.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  Code2,
  createIcons,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Orbit,
  Pause,
  Play,
  Sparkles,
} from 'lucide';
import { api } from './shared/api.js';

const icons = {
  ArrowDown, ArrowDownRight, ArrowUp, Code2, ExternalLink,
  GraduationCap, Mail, MapPin, Orbit, Pause, Play, Sparkles,
};

const fallbackContent = {
  settings: {
    name: 'Kenan Kuşçu',
    title: 'Yazılım Geliştirici ve Bilgisayar Programcılığı Öğrencisi',
    hero: 'Fikirleri anlaşılır, hızlı ve sağlam dijital ürünlere dönüştürüyorum.',
    about: 'Ankara Üniversitesi Bilgisayar Programcılığı öğrencisiyim. Öğrenirken üreten, kullanılabilir web deneyimleri geliştiren bir yazılım geliştiriciyim.',
    email: '',
    github_url: 'https://github.com/icarusexe',
    linkedin_url: '',
  },
  projects: [],
  skills: [],
};

let content = fallbackContent;
let motionEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const skillCanvases = [];

function makeMaterial(color, roughness = 0.45, metalness = 0.18) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function addBox(parent, size, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const context = canvas.getContext('2d');
  context.fillStyle = '#081021';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const glow = context.createRadialGradient(660, 250, 10, 660, 250, 520);
  glow.addColorStop(0, 'rgba(109,124,255,.25)');
  glow.addColorStop(1, 'rgba(5,8,22,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = '600 34px monospace';
  context.fillStyle = '#aeb8ff';
  context.fillText('kenan.dev', 70, 86);
  const lines = [
    ['#a06cff', 110, 180, 480],
    ['#6d7cff', 110, 245, 690],
    ['#59627f', 160, 310, 520],
    ['#59627f', 160, 375, 610],
    ['#8fd7c6', 110, 440, 390],
  ];
  lines.forEach(([color, x, y, width]) => {
    context.fillStyle = color;
    context.roundRect(x, y, width, 20, 10);
    context.fill();
  });
  context.fillStyle = '#7f88a6';
  context.font = '500 24px monospace';
  context.fillText('Cloudflare  /  D1  /  Vanilla JS', 110, 535);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createHeroScene() {
  const canvas = document.querySelector('#hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050816, 0.034);
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
  camera.position.set(0, 5.5, 12.5);

  const workspace = new THREE.Group();
  scene.add(workspace);
  const dark = makeMaterial(0x101426, 0.48, 0.35);
  const graphite = makeMaterial(0x1c2238, 0.38, 0.5);
  const cobalt = makeMaterial(0x5067e9, 0.25, 0.45);
  const violet = makeMaterial(0x8654d8, 0.3, 0.4);

  addBox(workspace, [7.8, 0.3, 4.8], [0, -1.25, 0], makeMaterial(0x17152b, 0.72, 0.08));
  addBox(workspace, [0.28, 2.35, 0.28], [-3.35, -2.4, -1.8], dark);
  addBox(workspace, [0.28, 2.35, 0.28], [3.35, -2.4, -1.8], dark);
  addBox(workspace, [0.28, 2.35, 0.28], [-3.35, -2.4, 1.8], dark);
  addBox(workspace, [0.28, 2.35, 0.28], [3.35, -2.4, 1.8], dark);

  addBox(workspace, [4.7, 2.8, 0.25], [0.35, 1.25, -0.85], graphite, [-0.05, 0, 0]);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.25, 2.35),
    new THREE.MeshBasicMaterial({ map: createScreenTexture(), toneMapped: false }),
  );
  screen.position.set(0.35, 1.25, -0.69);
  screen.rotation.x = -0.05;
  workspace.add(screen);
  addBox(workspace, [0.28, 1.5, 0.28], [0.35, -0.75, -0.78], graphite);
  addBox(workspace, [2.1, 0.16, 0.82], [0.35, -1.05, -0.45], graphite);

  const keyboard = new THREE.Group();
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 7; column += 1) {
      const accent = (row * 7 + column) % 8 === 0;
      addBox(keyboard, [0.43, 0.18, 0.42], [(column - 3) * 0.52, 0, (row - 1.5) * 0.5], accent ? cobalt : dark);
    }
  }
  keyboard.position.set(-0.45, -0.92, 1.08);
  keyboard.rotation.y = -0.08;
  workspace.add(keyboard);

  addBox(workspace, [1.05, 2.25, 1.75], [3.05, -0.05, -0.25], graphite);
  addBox(workspace, [0.78, 0.05, 1.15], [3.05, 0.28, 0.66], cobalt);
  const power = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), makeMaterial(0x8fd7c6, 0.2, 0.2));
  power.position.set(3.05, -0.65, 0.65);
  workspace.add(power);

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.75, 28), violet);
  cup.position.set(-2.75, -0.72, 0.65);
  cup.castShadow = true;
  workspace.add(cup);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 12, 28, Math.PI * 1.55), violet);
  handle.position.set(-2.4, -0.68, 0.65);
  handle.rotation.set(Math.PI / 2, 0, Math.PI / 2);
  workspace.add(handle);

  const floaters = [];
  [
    [-2.7, 1.65, 0.3, 0x6d7cff],
    [2.9, 2.45, 0.55, 0xa06cff],
    [2.3, 1.1, 2.2, 0x8fd7c6],
  ].forEach(([x, y, z, color], index) => {
    const geometry = index === 0
      ? new THREE.IcosahedronGeometry(0.42, 1)
      : index === 1 ? new THREE.OctahedronGeometry(0.44) : new THREE.TorusKnotGeometry(0.28, 0.09, 60, 10);
    const mesh = new THREE.Mesh(geometry, makeMaterial(color, 0.2, 0.55));
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    workspace.add(mesh);
    floaters.push(mesh);
  });

  const starGeometry = new THREE.BufferGeometry();
  const starCount = window.innerWidth < 700 ? 420 : 900;
  const stars = new Float32Array(starCount * 3);
  for (let index = 0; index < starCount * 3; index += 3) {
    stars[index] = (Math.random() - 0.5) * 38;
    stars[index + 1] = (Math.random() - 0.5) * 22;
    stars[index + 2] = -Math.random() * 22;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
  const starField = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xbac3ff, size: 0.035, transparent: true, opacity: 0.72 }));
  scene.add(starField);

  scene.add(new THREE.HemisphereLight(0x7181c7, 0x080611, 1.15));
  const keyLight = new THREE.DirectionalLight(0x8fa1ff, 4.5);
  keyLight.position.set(-5, 9, 7);
  keyLight.castShadow = true;
  scene.add(keyLight);
  const purpleLight = new THREE.PointLight(0x9b5cff, 22, 16);
  purpleLight.position.set(4, 2.5, 3);
  scene.add(purpleLight);
  const blueLight = new THREE.PointLight(0x456dff, 18, 15);
  blueLight.position.set(-4, 0, -1);
  scene.add(blueLight);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 17;
  controls.minPolarAngle = 0.65;
  controls.maxPolarAngle = 1.48;
  controls.autoRotate = motionEnabled;
  controls.autoRotateSpeed = 0.35;

  function layout() {
    const mobile = window.innerWidth < 760;
    workspace.position.set(mobile ? 0 : 3.35, mobile ? -0.55 : 0.05, 0);
    workspace.scale.setScalar(mobile ? 0.72 : 0.9);
    workspace.rotation.set(-0.06, -0.38, -0.02);
    controls.target.set(mobile ? 0 : 3.35, -0.2, 0);
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    layout();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  return {
    render(time) {
      if (motionEnabled) {
        floaters.forEach((mesh, index) => {
          mesh.rotation.x = time * (0.00025 + index * 0.00006);
          mesh.rotation.y = time * (0.0004 + index * 0.00008);
          mesh.position.y += Math.sin(time * 0.0012 + index * 2) * 0.0008;
        });
        starField.rotation.y = time * 0.000012;
        purpleLight.position.x = 4 + Math.sin(time * 0.0005) * 1.4;
      }
      controls.autoRotate = motionEnabled;
      controls.update();
      renderer.render(scene, camera);
    },
  };
}

function createContactScene() {
  const canvas = document.querySelector('#contact-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.set(0, 0, 6.4);
  const globe = new THREE.Group();
  scene.add(globe);
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.85, 32, 22),
    new THREE.MeshBasicMaterial({ color: 0x7587ff, wireframe: true, transparent: true, opacity: 0.22 }),
  );
  globe.add(sphere);
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.58, 32, 22),
    new THREE.MeshStandardMaterial({ color: 0x0b1230, roughness: 0.7, metalness: 0.35 }),
  );
  globe.add(core);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.025, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0xa06cff, transparent: true, opacity: 0.72 }),
  );
  ring.rotation.set(1.15, 0.2, 0.25);
  globe.add(ring);
  scene.add(new THREE.HemisphereLight(0x6d7cff, 0x080914, 2.2));
  const light = new THREE.PointLight(0xa06cff, 18, 15);
  light.position.set(3, 2, 4);
  scene.add(light);

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  return {
    render(time) {
      if (motionEnabled) {
        globe.rotation.y = time * 0.00018;
        ring.rotation.z = 0.25 + Math.sin(time * 0.00035) * 0.18;
      }
      renderer.render(scene, camera);
    },
  };
}

function iconLink(url, label, icon, withText = false) {
  const link = document.createElement('a');
  link.href = url;
  if (!url.startsWith('mailto:')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  link.setAttribute('aria-label', label);
  link.title = label;
  const node = document.createElement('i');
  node.dataset.lucide = icon;
  link.append(node);
  if (withText) {
    const text = document.createElement('span');
    text.textContent = label;
    link.append(text);
  }
  return link;
}

function drawProjectPreview(canvas, project, index) {
  const context = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 620;
  context.fillStyle = index % 2 ? '#0b1022' : '#080d1d';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const glow = context.createRadialGradient(index % 2 ? 760 : 250, 220, 10, index % 2 ? 760 : 250, 220, 480);
  glow.addColorStop(0, index % 2 ? 'rgba(160,108,255,.28)' : 'rgba(109,124,255,.3)');
  glow.addColorStop(1, 'rgba(5,8,22,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'rgba(150,165,220,.09)';
  context.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 55) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke();
  }
  for (let y = 0; y < canvas.height; y += 55) {
    context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke();
  }
  context.fillStyle = '#dfe4ff';
  context.font = '700 43px Manrope, sans-serif';
  context.fillText(project.title, 72, 105);
  context.fillStyle = '#7781a2';
  context.font = '500 22px monospace';
  context.fillText(`/${project.slug}`, 74, 150);
  const technologies = project.technologies.slice(0, 4);
  technologies.forEach((technology, techIndex) => {
    const x = 105 + techIndex * 205;
    const y = 330 + Math.sin(techIndex) * 45;
    context.beginPath();
    context.fillStyle = techIndex % 2 ? '#a06cff' : '#6d7cff';
    context.arc(x, y, 42, 0, Math.PI * 2);
    context.fill();
    if (techIndex < technologies.length - 1) {
      context.strokeStyle = 'rgba(180,190,255,.45)';
      context.lineWidth = 3;
      context.beginPath(); context.moveTo(x + 48, y); context.lineTo(x + 155, 330 + Math.sin(techIndex + 1) * 45); context.stroke();
    }
    context.fillStyle = '#f2f4ff';
    context.font = '600 18px Manrope, sans-serif';
    context.textAlign = 'center';
    context.fillText(technology.length > 16 ? `${technology.slice(0, 14)}…` : technology, x, y + 78);
  });
  context.textAlign = 'left';
  context.fillStyle = '#8fd7c6';
  context.font = '600 18px monospace';
  context.fillText('●  ACTIVE BUILD', 74, 555);
}

function bindTilt(card) {
  card.addEventListener('pointermove', (event) => {
    if (!motionEnabled || event.pointerType === 'touch') return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty('--tilt-x', `${-y * 7}deg`);
    card.style.setProperty('--tilt-y', `${x * 9}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  });
}

function renderProjects() {
  const container = document.querySelector('#project-list');
  container.replaceChildren();
  if (!content.projects.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Yeni çalışmalar yakında burada olacak.';
    container.append(empty);
    return;
  }
  content.projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-item';
    const visual = document.createElement('div');
    visual.className = 'project-visual';
    if (project.image_url) {
      const image = document.createElement('img');
      image.src = project.image_url;
      image.alt = `${project.title} proje kapağı`;
      image.loading = 'lazy';
      visual.append(image);
    } else {
      const preview = document.createElement('canvas');
      preview.setAttribute('aria-label', `${project.title} mimari önizlemesi`);
      visual.append(preview);
      drawProjectPreview(preview, project, index);
    }
    const body = document.createElement('div');
    body.className = 'project-body';
    const indexNode = document.createElement('span');
    indexNode.className = 'project-index';
    indexNode.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('h3');
    title.textContent = project.title;
    const summary = document.createElement('p');
    summary.textContent = project.summary;
    const tags = document.createElement('div');
    tags.className = 'tech-list';
    project.technologies.forEach((technology) => {
      const tag = document.createElement('span');
      tag.textContent = technology;
      tags.append(tag);
    });
    const links = document.createElement('div');
    links.className = 'project-links';
    if (project.live_url) links.append(iconLink(project.live_url, 'Canlı demoyu aç', 'external-link', true));
    if (project.source_url) links.append(iconLink(project.source_url, 'GitHub deposunu aç', 'code-2', true));
    body.append(indexNode, title, summary, tags, links);
    card.append(visual, body);
    bindTilt(card);
    container.append(card);
  });
}

function drawSkillIcon(canvas, skill, index, time = 0) {
  const context = canvas.getContext('2d');
  const size = 160;
  if (canvas.width !== size) {
    canvas.width = size;
    canvas.height = size;
  }
  context.clearRect(0, 0, size, size);
  const center = size / 2;
  const phase = time * 0.00045 + index * 0.7;
  const gradient = context.createRadialGradient(58, 50, 6, center, center, 62);
  gradient.addColorStop(0, index % 2 ? '#b994ff' : '#9aa8ff');
  gradient.addColorStop(0.55, index % 2 ? '#7147bb' : '#4657c7');
  gradient.addColorStop(1, '#101631');
  context.fillStyle = gradient;
  context.beginPath(); context.arc(center, center, 49, 0, Math.PI * 2); context.fill();
  context.strokeStyle = 'rgba(230,234,255,.56)';
  context.lineWidth = 2;
  context.beginPath();
  context.ellipse(center, center, Math.max(7, Math.abs(Math.cos(phase)) * 66), 22, phase * 0.35, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = '#f4f5ff';
  context.font = '700 28px Manrope, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const initials = skill.name.split(/\s|\//).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  context.fillText(initials, center, center + 1);
}

function renderSkills() {
  const container = document.querySelector('#skills-list');
  container.replaceChildren();
  skillCanvases.length = 0;
  if (!content.skills.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Yetenek listesi yakında güncellenecek.';
    container.append(empty);
    return;
  }
  content.skills.forEach((skill, index) => {
    const card = document.createElement('article');
    card.className = 'skill-row';
    const icon = document.createElement('canvas');
    icon.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('div');
    const name = document.createElement('h3');
    name.textContent = skill.name;
    const category = document.createElement('p');
    category.textContent = skill.category || 'Teknoloji';
    const meter = document.createElement('span');
    meter.className = 'skill-meter';
    meter.style.setProperty('--skill-level', `${skill.level}%`);
    copy.append(name, category, meter);
    card.append(icon, copy);
    container.append(card);
    skillCanvases.push({ canvas: icon, skill, index });
    drawSkillIcon(icon, skill, index);
  });
}

function renderContacts() {
  const { settings } = content;
  const container = document.querySelector('#contact-links');
  container.replaceChildren();
  const contacts = [
    [settings.email ? `mailto:${settings.email}` : '', settings.email || 'E-posta', 'mail'],
    [settings.github_url, 'GitHub', 'code-2'],
    [settings.linkedin_url, 'LinkedIn', 'external-link'],
  ];
  contacts.filter(([url]) => url).forEach(([url, label, icon]) => container.append(iconLink(url, label, icon, true)));
  const heroGithub = document.querySelector('#hero-github');
  if (settings.github_url) heroGithub.href = settings.github_url;
  const heroEmail = document.querySelector('#hero-email');
  if (settings.email) heroEmail.href = `mailto:${settings.email}`;
}

function renderName(name) {
  const heading = document.querySelector('#hero-name');
  const parts = name.trim().split(/\s+/);
  heading.replaceChildren();
  parts.forEach((part, index) => {
    if (index) heading.append(document.createTextNode(' '), document.createElement('br'));
    heading.append(document.createTextNode(part));
  });
}

function render() {
  const { settings } = content;
  document.title = `${settings.name} | ${settings.title}`;
  renderName(settings.name);
  document.querySelector('#hero-title').textContent = settings.title;
  document.querySelector('#hero-statement').textContent = settings.hero;
  document.querySelector('#about-copy').textContent = settings.about;
  renderProjects();
  renderSkills();
  renderContacts();
  createIcons({ icons });
}

function updateMotionButton() {
  const button = document.querySelector('#motion-toggle');
  button.setAttribute('aria-label', motionEnabled ? 'Hareketi durdur' : 'Hareketi başlat');
  button.title = motionEnabled ? 'Hareketi durdur' : 'Hareketi başlat';
  const icon = document.createElement('i');
  icon.dataset.lucide = motionEnabled ? 'pause' : 'play';
  button.replaceChildren(icon);
  createIcons({ icons, root: button });
}

document.querySelector('#motion-toggle').addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
  updateMotionButton();
});

document.querySelector('#year').textContent = new Date().getFullYear();
document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
render();

let heroScene;
let contactScene;
try {
  heroScene = createHeroScene();
  contactScene = createContactScene();
  document.documentElement.classList.add('webgl-ready');
} catch (error) {
  console.warn('3D sahne başlatılamadı.', error);
  document.documentElement.classList.add('webgl-fallback');
}

function animate(time) {
  if (!document.hidden) {
    heroScene?.render(time);
    contactScene?.render(time);
    if (motionEnabled) skillCanvases.forEach(({ canvas, skill, index }) => drawSkillIcon(canvas, skill, index, time));
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

try {
  content = await api('/api/public');
  render();
} catch {
  const container = document.querySelector('#project-list');
  container.replaceChildren();
  const error = document.createElement('p');
  error.className = 'empty-state';
  error.textContent = 'İçerik şu anda yüklenemedi. Lütfen biraz sonra tekrar dene.';
  container.append(error);
}
