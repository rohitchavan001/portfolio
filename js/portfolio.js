/* =============================================
   PORTFOLIO – Vanilla JS
   ============================================= */

(function () {
  'use strict';

  // ── Dark Mode ──────────────────────────────
  const toggleBtn = document.querySelector('.dark-mode-toggle');

  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  const saved = localStorage.getItem('theme');
  if (!saved) applyTheme(true);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
  });

  // ── Mobile Nav Toggle ──────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.getElementById('main-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Active Nav Link on Scroll ──────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('#main-nav a');

  function setActiveLink() {
    const scrollY = window.scrollY + 80;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`#main-nav a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ── Smooth Scroll ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Footer Year ───────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Typing Effect ─────────────────────────
  const typedEl = document.getElementById('typed-role');
  if (typedEl) {
    const phrases = ['Full Stack Developer', 'UI/UX Designer', 'Open Source Contributor', 'Problem Solver'];
    let pi = 0, ci = 0, deleting = false;

    function type() {
      const phrase = phrases[pi];
      typedEl.textContent = deleting ? phrase.slice(0, ci--) : phrase.slice(0, ci++);

      if (!deleting && ci > phrase.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      if (deleting && ci < 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        ci = 0;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, deleting ? 45 : 80);
    }
    setTimeout(type, 600);
  }

  // ── Hero Canvas Particles ─────────────────
  // (removed)

  // ── Scroll Reveal ─────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ── Trailing Dots Cursor ──────────────────
  const TRAIL_COUNT = 12;
  const trails = [];
  let mx = -200, my = -200;

  const main = document.createElement('div');
  main.className = 'cursor-main';
  document.body.appendChild(main);

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    const size = 12 * (1 - i / TRAIL_COUNT) + 2;
    t.style.cssText = `width:${size}px;height:${size}px;opacity:${0.6 * (1 - i / TRAIL_COUNT)}`;
    t.x = -200; t.y = -200;
    trails.push(t);
    document.body.appendChild(t);
  }

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function animateTrail() {
    main.style.left = mx + 'px';
    main.style.top  = my + 'px';

    let px = mx, py = my;
    trails.forEach(t => {
      t.x += (px - t.x) * 0.3;
      t.y += (py - t.y) * 0.3;
      t.style.left = t.x + 'px';
      t.style.top  = t.y + 'px';
      px = t.x; py = t.y;
    });

    requestAnimationFrame(animateTrail);
  })();

  // ── Project Card 3D Tilt (desktop only) ──
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      const shine = card.querySelector('.tilt-shine');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) *  8;

        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
        if (shine) {
          shine.style.setProperty('--mx', (x / rect.width  * 100) + '%');
          shine.style.setProperty('--my', (y / rect.height * 100) + '%');
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Form Validation ───────────────────────
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: form.querySelector('#name'),    error: form.querySelector('#name-error'),    validate: v => v.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).' },
    email:   { el: form.querySelector('#email'),   error: form.querySelector('#email-error'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    message: { el: form.querySelector('#message'), error: form.querySelector('#message-error'), validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
  };

  function validateField(key) {
    const { el, error, validate } = fields[key];
    const msg = validate(el.value);
    error.textContent = msg;
    el.classList.toggle('invalid', !!msg);
    return !msg;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    const successMsg = document.getElementById('form-success');
    successMsg.hidden = false;
    form.reset();
    Object.keys(fields).forEach(k => fields[k].el.classList.remove('invalid'));
    setTimeout(() => { successMsg.hidden = true; }, 5000);
  });

})();
