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

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
