// MyEliteHealth · Landing v1.1.2 — animaciones en JavaScript sin librerías.
// Todo respeta «Reducir movimiento» del sistema.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ── Hero: el título entra al cargar ───────────────────────────────
requestAnimationFrame(() => $('.hero')?.classList.add('ready'));

// ── Barra de progreso, navegación, línea de tiempo y parallax ──────
const progress = $('.progress');
const nav = $('.nav');
const timeline = $('.timeline');
const floaters = $$('[data-float]');
let ticking = false;

function onScroll() {
  const h = document.documentElement;
  const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
  if (progress) progress.style.transform = `scaleX(${p})`;
  if (nav && !nav.classList.contains('nav-solid')) nav.classList.toggle('scrolled', h.scrollTop > 30);
  if (timeline) {
    const r = timeline.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
    timeline.style.setProperty('--tl', t.toFixed(3));
  }
  if (!reduce) {
    for (const el of floaters) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const speed = Number(el.dataset.float || 0.06);
      const center = r.top + r.height / 2 - innerHeight / 2;
      el.style.translate = `0 ${(-center * speed).toFixed(1)}px`;
    }
  }
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
addEventListener('resize', () => requestAnimationFrame(onScroll), { passive: true });

// ── Menú móvil ─────────────────────────────────────────────────────
const toggle = $('.menu-toggle');
const links = $('.nav-links');
toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
$$('.nav-links a').forEach((a) => a.addEventListener('click', () => {
  links?.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

// Enlace activo según la sección visible
const sections = $$('main section[id]');
const navMap = new Map($$('.nav-links a[href^="#"]').map((a) => [a.getAttribute('href').slice(1), a]));
const navIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    navMap.forEach((a) => a.classList.remove('active'));
    navMap.get(e.target.id)?.classList.add('active');
  }
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => navIO.observe(s));

// ── Revelado al entrar en pantalla ────────────────────────────────
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    const delay = reduce ? 0 : Number(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('in'), delay);
    if (el.matches('[data-count]')) countUp(el);
    if (el.matches('[data-momentum]')) drawMomentum(el);
    if (el.matches('[data-readiness]')) ring(el);
    io.unobserve(el);
  }
}, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
$$('[data-reveal], [data-count], [data-momentum], [data-readiness]').forEach((el) => io.observe(el));

// Contadores
function countUp(el) {
  const end = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (reduce) { el.textContent = end + suffix; return; }
  const dur = 1500; const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Anillo de «¿Listo para jugar?» (ilustración)
function ring(el) {
  const val = $('.val', el);
  const len = 2 * Math.PI * 88;
  const target = Number(el.dataset.readiness);
  val.style.strokeDasharray = len;
  val.style.strokeDashoffset = len;
  val.getBoundingClientRect();
  val.style.strokeDashoffset = len * (1 - target / 100);
  const num = $('[data-count-ring]', el);
  if (num) { num.dataset.count = target; countUp(num); }
}

// ── Botones «magnéticos» (solo con ratón) ─────────────────────────
if (finePointer && !reduce) {
  $$('[data-magnetic]').forEach((b) => {
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.28;
      b.style.transform = `translate(${x}px, ${y}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}

// Inclinación del escenario del hero con el ratón
const stage = $('.hero-stage');
if (stage && !reduce && finePointer) {
  stage.style.transition = 'transform .5s ease-out';
  stage.style.transformStyle = 'preserve-3d';
  stage.addEventListener('mousemove', (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.style.transform = `perspective(1400px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
  });
  stage.addEventListener('mouseleave', () => { stage.style.transform = ''; });
}

// ── Reloj del hero: un partido que se juega solo ──────────────────
const watch = $('[data-watch]');
if (watch) {
  const pts = ['0', '15', '30', '40'];
  const me = $('[data-me]', watch), them = $('[data-them]', watch), games = $('[data-games]', watch);
  let a = 0, b = 0, ga = 4, gb = 3;
  const seq = [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1];
  let i = 0;
  const point = () => {
    const mine = seq[i++ % seq.length] === 1;
    if (mine) a++; else b++;
    // Punto de oro: en 40-40 el siguiente punto gana el juego.
    if (a === 4 || b === 4) {
      if (a > b) ga++; else gb++;
      a = 0; b = 0;
      if (ga >= 6 || gb >= 6) { ga = 4; gb = 3; }
    }
    me.textContent = pts[a];
    them.textContent = pts[b];
    games.textContent = `SET 2 · ${ga}-${gb}`;
    const el = mine ? me : them;
    el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 260);
  };
  if (!reduce) setInterval(point, 1600);
}

// ── Pádel: el relato cambia la captura fija ───────────────────────
const steps = $$('.step');
const pinned = $$('.story-pin .device');
const dots = $$('.story-dots span');
if (steps.length && pinned.length) {
  const show = (k) => {
    steps.forEach((s, j) => s.classList.toggle('active', j === k));
    pinned.forEach((d, j) => d.classList.toggle('on', j === k));
    dots.forEach((d, j) => d.classList.toggle('on', j === k));
  };
  const stepIO = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) show(steps.indexOf(e.target));
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => stepIO.observe(s));
  show(0);
}

// ── Pestañas de métricas ──────────────────────────────────────────
$$('[data-tabs]').forEach((box) => {
  const tabs = $$('[data-tab]', box);
  const panels = $$('[data-panel]', box);
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', String(x === t)); });
    panels.forEach((p) => p.classList.toggle('on', p.dataset.panel === t.dataset.tab));
  }));
});

// ── Pista: lado drive / revés ─────────────────────────────────────
const court = $('[data-court]');
if (court) {
  const caption = $('[data-court-caption]', court);
  const player = $('.player', court);
  const texts = {
    reves: 'Juegas de <b>revés</b> (izquierda). La app guarda tus sets en ese lado y te enseña cómo te va jugando ahí frente a jugando de drive.',
    drive: 'Juegas de <b>drive</b> (derecha). Si cambiáis de lado entre sets, cada set guarda el suyo.',
  };
  const set = (side) => {
    $$('button', court).forEach((b) => b.classList.toggle('on', b.dataset.side === side));
    player.style.left = side === 'reves' ? 'calc(25% - 15px)' : 'calc(75% - 15px)';
    caption.innerHTML = texts[side];
  };
  $$('button', court).forEach((b) => b.addEventListener('click', () => set(b.dataset.side)));
  set('drive');
}

// ── Momentum (partido de ejemplo, marcado como tal en la web) ─────
// Secuencia determinista de 80 puntos: win = punto de tu pareja.
function demoPoints() {
  let s = 11; const out = [];
  for (let k = 0; k < 80; k++) {
    s = (s * 9301 + 49297) % 233280;
    const bias = k < 30 ? 0.46 : k < 55 ? 0.56 : 0.61;
    out.push({
      win: s / 233280 < bias,
      breakPoint: k % 9 === 4,
      high: s % 5 === 0,
      long: s % 7 === 0,
      decisive: k === 38 || k === 79,
    });
  }
  return out;
}
const POINTS = demoPoints();

function drawMomentum(card) {
  const svg = $('svg', card);
  const W = 600, H = 220;
  let v = 0; const vals = [0];
  POINTS.forEach((p) => { v += p.win ? 1 : -1; vals.push(v); });
  const max = Math.max(6, ...vals.map(Math.abs));
  const x = (k) => (k / (vals.length - 1)) * W;
  const y = (val) => H / 2 - (val / max) * (H / 2 - 10);
  const d = vals.map((val, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)} ${y(val).toFixed(1)}`).join(' ');
  const path = $('.path', svg);
  path.setAttribute('d', d);
  $('.area', svg).setAttribute('d', `${d} L${W} ${H / 2} L0 ${H / 2} Z`);
  const dotsG = $('.dots', svg);
  dotsG.innerHTML = '';
  POINTS.forEach((p, k) => {
    if (!p.breakPoint) return;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x(k + 1)); c.setAttribute('cy', y(vals[k + 1])); c.setAttribute('r', 5);
    c.setAttribute('class', p.win ? 'dot-win' : 'dot-loss');
    dotsG.appendChild(c);
  });
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = reduce ? 0 : len;
  path.getBoundingClientRect();
  path.style.transition = reduce ? 'none' : 'stroke-dashoffset 2.4s cubic-bezier(.4,.1,.2,1)';
  path.style.strokeDashoffset = 0;

  // Tocar o pasar el ratón: ver el punto
  const cursor = $('.cursor', svg);
  const read = $('[data-momentum-read]', card);
  const pick = (clientX) => {
    const r = svg.getBoundingClientRect();
    const k = Math.min(POINTS.length, Math.max(1, Math.round(((clientX - r.left) / r.width) * POINTS.length)));
    const p = POINTS[k - 1];
    cursor.setAttribute('x1', x(k)); cursor.setAttribute('x2', x(k));
    cursor.style.opacity = 1;
    const diff = vals[k];
    read.innerHTML = `<span>Punto <b>${k}</b> · ${p.win ? '<b class="blue">ganado</b>' : '<b class="red">perdido</b>'}${p.breakPoint ? ' · bola de break' : ''}</span><span>Diferencia <b>${diff > 0 ? '+' : ''}${diff}</b></span>`;
  };
  svg.addEventListener('pointermove', (e) => pick(e.clientX));
  svg.addEventListener('pointerdown', (e) => pick(e.clientX));
}

// Filtros de puntos (como en la app)
const filterBox = $('[data-filters]');
if (filterBox) {
  const rules = {
    todos: () => true,
    ganados: (p) => p.win,
    perdidos: (p) => !p.win,
    break: (p) => p.breakPoint,
    decisivos: (p) => p.decisive,
    altos: (p) => p.high,
    largos: (p) => p.long,
  };
  const result = $('[data-filter-result]');
  const bar = $('[data-filter-bar]');
  $$('[data-filter]', filterBox).forEach((chip) => {
    const rule = rules[chip.dataset.filter];
    $('.chip-count', chip).textContent = POINTS.filter(rule).length;
    chip.addEventListener('click', () => {
      $$('[data-filter]', filterBox).forEach((c) => c.classList.toggle('on', c === chip));
      const sel = POINTS.filter(rule);
      const won = sel.filter((p) => p.win).length;
      const pct = Math.round((won / Math.max(1, sel.length)) * 100);
      result.textContent = `${sel.length} puntos · ganaste ${won} (${pct} %)`;
      bar.style.width = `${pct}%`;
    });
  });
  $('[data-filter="todos"]', filterBox).click();
}

// Primer pintado, cuando todo lo anterior ya está definido.
onScroll();
