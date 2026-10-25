document.documentElement.classList.add('js');

const calm = window.matchMedia('(prefers-reduced-motion: no-preference)');

// Mobile menu: items arrive one after another (CSS reads --i)
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  [...nav.children].forEach((el, i) => el.style.setProperty('--i', i));
  const close = () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    close();
    // Closes the treatments panel too, which opens on focus
    if (nav.contains(document.activeElement)) document.activeElement.blur();
  });
}

// Hairline under the header once the page moves
const header = document.querySelector('.site-header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Arriving: whatever comes into view together settles in one after another
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          e.target.style.setProperty('--delay', `${Math.min(i, 5) * 0.16}s`);
          e.target.classList.add('in');
          io.unobserve(e.target);
        });
    },
    { rootMargin: '0px 0px -10% 0px' }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// Drift: some photos move a touch slower than the page, for depth.
// Desktop pointers only, and never when reduced motion is asked for.
const drifters = [...document.querySelectorAll('[data-drift]')];
const deep = window.matchMedia('(pointer: fine) and (min-width: 961px)');
if (drifters.length) {
  let ticking = false;
  const place = () => {
    ticking = false;
    const on = calm.matches && deep.matches;
    const mid = window.innerHeight / 2;
    drifters.forEach((el) => {
      if (!on) { el.style.translate = ''; return; }
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const offset = r.top + r.height / 2 - mid;
      el.style.translate = `0 ${(-offset * parseFloat(el.dataset.drift)).toFixed(1)}px`;
    });
  };
  const ask = () => { if (!ticking) { ticking = true; requestAnimationFrame(place); } };
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
  place();
}

// Treatments section bar: highlight the section being read, glide the gold line to it
const subnav = document.querySelector('.subnav');
if (subnav) {
  const track = subnav.querySelector('.subnav-track');
  const ink = subnav.querySelector('.subnav-ink');
  const links = [...subnav.querySelectorAll('a')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href')));
  let current = null;
  const setActive = (a) => {
    if (a === current) return;
    current = a;
    links.forEach((l) => l.classList.toggle('active', l === a));
    if (!a) { ink.style.width = '0'; return; }
    ink.style.width = `${a.offsetWidth}px`;
    ink.style.transform = `translateX(${a.offsetLeft}px)`;
    if (track.scrollWidth > track.clientWidth) {
      track.scrollTo({ left: a.offsetLeft - 24, behavior: calm.matches ? 'smooth' : 'auto' });
    }
  };
  const pick = () => {
    const line = window.innerHeight * 0.35;
    let found = null;
    let best = -Infinity;
    targets.forEach((t, i) => {
      const top = t ? t.getBoundingClientRect().top : Infinity;
      if (top <= line && top > best) { best = top; found = links[i]; }
    });
    setActive(found);
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; pick(); }); }
  }, { passive: true });
  window.addEventListener('resize', () => { const a = current; current = null; setActive(a); });
  pick();
}

// Arriving from the BAE. family page (contact.html?interest=retreats) picks that branch
const interest = new URLSearchParams(location.search).get('interest');
const pickTreatment = document.querySelector('select[name="treatment"]');
if (interest && pickTreatment) {
  const opt = [...pickTreatment.options].find((o) => o.value === interest);
  if (opt) pickTreatment.value = opt.value;
}

// Enquiry form: posts to Netlify Forms when hosted there. Anywhere else (GitHub Pages,
// local preview) the post fails, so say so rather than thank her for a lost message.
const form = document.querySelector('form.enquiry');
if (form) {
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-error');
    btn.disabled = true;
    status.hidden = true;
    let ok = false;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      ok = res.ok;
    } catch (_) {}
    if (ok) {
      form.classList.add('sent');
    } else {
      status.hidden = false;
      btn.disabled = false;
    }
  });
}

// Header name: "BAE." plus whichever part of BAE. you're in (data-brand on a
// section, or the page's own on <body>), changing with a soft fade
const MASTER = 'by Angela Ewart';
const sub = document.querySelector('.brand .sub');
if (sub) {
  const base = document.body.dataset.brand || MASTER;
  const zones = [...document.querySelectorAll('main [data-brand]')];
  let shown = sub.textContent.trim();
  let swap = null;
  const show = (label) => {
    if (label === shown) return;
    shown = label;
    clearTimeout(swap);
    sub.classList.add('out');
    swap = setTimeout(() => {
      sub.textContent = label;
      sub.classList.toggle('master', label === MASTER);
      sub.classList.remove('out');
    }, calm.matches ? 480 : 0);
  };
  const read = () => {
    // Same reading line as the section bar, so the two always agree
    const line = window.innerHeight * 0.35;
    const here = zones.find((z) => {
      const r = z.getBoundingClientRect();
      return r.top <= line && r.bottom > line;
    });
    show(here ? here.dataset.brand : base);
  };
  let queued = false;
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; read(); }); }
  }, { passive: true });
  read();
}

// The logo veil. Every link, whether to another page or to a section of this one,
// fades to ivory, lets the logo breathe while its ring draws, moves there unseen,
// and fades back: no fast scrolling, and every place feels like its own page.
const veil = document.createElement('div');
veil.className = 'veil';
veil.setAttribute('aria-hidden', 'true');
veil.innerHTML =
  '<div class="veil-mark"><svg class="veil-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47"/></svg>' +
  '<img src="assets/img/logo.png?v=2" alt=""></div><span class="veil-word"></span>';
document.body.appendChild(veil);
const veilWord = veil.querySelector('.veil-word');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const draw = () => {
  veil.classList.remove('drawing');
  void veil.offsetWidth; // restart the ring
  veil.classList.add('drawing');
};
const lift = () => veil.classList.remove('on', 'drawing');
const useVeil = calm.matches;

// Arriving on a page: the ivory screen from <head> becomes the veil, then lifts
if (document.documentElement.classList.contains('veiled')) {
  const brand = document.body.dataset.brand || MASTER;
  veilWord.textContent = brand === MASTER ? 'BAE. by Angela Ewart' : `BAE. ${brand}`;
  veil.classList.add('on');
  draw();
  requestAnimationFrame(() => document.documentElement.classList.remove('veiled'));
  const started = performance.now();
  const ready = Promise.race([
    Promise.all([document.fonts ? document.fonts.ready : null, new Promise((r) => {
      if (document.readyState === 'complete') r(); else window.addEventListener('load', r, { once: true });
    })]),
    wait(2200),
  ]);
  ready.then(() => wait(Math.max(0, 900 - (performance.now() - started)))).then(lift);
}
// Coming back with the Back button can restore a page with the veil still down
window.addEventListener('pageshow', (e) => { if (e.persisted) lift(); });

const labelFor = (a) => {
  const strong = a.querySelector('strong, .next span');
  const text = (strong ? strong.textContent : a.textContent).replace(/\s+/g, ' ').trim();
  return text.length > 40 ? '' : text;
};

let travelling = false;
document.addEventListener('click', async (e) => {
  const a = e.target.closest('a[href]');
  if (!a || !useVeil || e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download')) return;
  const href = a.getAttribute('href');
  if (!href || href === '#') return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  e.preventDefault();
  if (travelling) return;
  travelling = true;

  document.body.classList.remove('nav-open');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  if (document.activeElement) document.activeElement.blur();

  veilWord.textContent = labelFor(a);
  veil.classList.add('on');
  draw();
  await wait(700);

  const samePage = url.pathname === location.pathname && url.search === location.search;
  if (!samePage) {
    location.href = url.href; // the next page arrives under its own veil
    return;
  }
  const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
  if (url.hash) history.pushState(null, '', url.hash);
  if (target) target.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 0);
  await wait(650);
  lift();
  travelling = false;
});

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
