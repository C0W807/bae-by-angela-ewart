document.documentElement.classList.add('js');

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav a').forEach((a) =>
    a.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Hairline under the header once the page moves
const header = document.querySelector('.site-header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Fade sections in as they arrive
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px' }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
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
