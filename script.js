/* ============================================================
   ARVEE LAW v2 — JAVASCRIPT
   Editorial layout interactions & animations
   ============================================================ */

'use strict';

/* ══════════════════════════════════════
   CURSOR
════════════════════════════════════════ */
const curDot  = document.querySelector('.cur-dot');
const curRing = document.querySelector('.cur-ring');

if (curDot && curRing) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    curDot.style.left = mx + 'px';
    curDot.style.top  = my + 'px';
  });

  (function trackRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    curRing.style.left = rx + 'px';
    curRing.style.top  = ry + 'px';
    requestAnimationFrame(trackRing);
  })();

  document.querySelectorAll('a, button, .pa-item, .phil-pillar, .test-card').forEach(el => {
    el.addEventListener('mouseenter', () => { curDot.classList.add('hov'); curRing.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { curDot.classList.remove('hov'); curRing.classList.remove('hov'); });
  });
}

/* ══════════════════════════════════════
   HEADER SCROLL STATE
════════════════════════════════════════ */
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  bttToggle();
}, { passive: true });

/* ══════════════════════════════════════
   MOBILE DRAWER
════════════════════════════════════════ */
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('drawer');
const dClose  = document.getElementById('drawerClose');
const dOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  drawer.classList.add('open');
  dOverlay.classList.add('show');
  burger.classList.add('open');
  document.body.classList.add('no-scroll');
}
function closeDrawer() {
  drawer.classList.remove('open');
  dOverlay.classList.remove('show');
  burger.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

burger.addEventListener('click', openDrawer);
dClose.addEventListener('click', closeDrawer);
dOverlay.addEventListener('click', closeDrawer);
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

/* ══════════════════════════════════════
   SMOOTH SCROLL
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════
   HERO HEADLINE — staggered line reveal
════════════════════════════════════════ */
(function heroReveal() {
  const lines = document.querySelectorAll('.line-wrap');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(60px)';
    line.style.transition = `opacity .8s ${i * 0.12}s, transform .8s ${i * 0.12}s cubic-bezier(0.25,0.46,0.45,0.94)`;
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 300 + i * 120);
  });

  // Fade in other hero elements
  ['.hero-eyebrow', '.hero-body', '.hero-actions', '.hero-scroll-hint'].forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .7s ${0.6 + i * 0.15}s, transform .7s ${0.6 + i * 0.15}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  });
})();

/* ══════════════════════════════════════
   INTERSECTION OBSERVER — generic reveal
════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Add reveal classes to elements
document.querySelectorAll(
  '.story-pull-quote, .story-body p, .story-stats, ' +
  '.pa-item, .phil-pillar, .test-card, ' +
  '.contact-title, .contact-details, .contact-heritage'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity .7s ${(i % 4) * 0.08}s, transform .7s ${(i % 4) * 0.08}s cubic-bezier(0.25,0.46,0.45,0.94)`;
  el.classList.add('reveal-target');
  revealObserver.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

// Apply in-view styles
const style = document.createElement('style');
style.textContent = '.reveal-target.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

/* ══════════════════════════════════════
   STAT COUNTERS
════════════════════════════════════════ */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const dur = 1600;
    const step = target / (dur / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(t);
    }, 16);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.s-num').forEach(el => statObserver.observe(el));

/* ══════════════════════════════════════
   PRACTICE ACCORDION
════════════════════════════════════════ */
document.querySelectorAll('.pa-item').forEach(item => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.pa-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

/* ══════════════════════════════════════
   TESTIMONIAL SLIDER
════════════════════════════════════════ */
(function initTestSlider() {
  const track = document.getElementById('testTrack');
  const cards = track ? track.querySelectorAll('.test-card') : [];
  const prev  = document.getElementById('tPrev');
  const next  = document.getElementById('tNext');
  if (!track || !cards.length) return;

  let current = 0;
  const total = cards.length;

  function getCardWidth() {
    const card = cards[0];
    const style = getComputedStyle(card);
    return card.offsetWidth + parseInt(style.marginRight || 0) + parseInt(style.marginLeft || 0);
  }

  function goTo(idx) {
    current = (idx + total) % total;
    const offset = current * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Auto-advance
  let auto = setInterval(() => goTo(current + 1), 5000);
  [prev, next].forEach(btn => btn.addEventListener('click', () => {
    clearInterval(auto);
    auto = setInterval(() => goTo(current + 1), 5000);
  }));
})();

/* ══════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('cfSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.cf-submit');
    btn.querySelector('.cf-submit-text').textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 1400);
  });
})();

/* ══════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════ */
const btt = document.getElementById('btt');
function bttToggle() { btt.classList.toggle('show', window.scrollY > 500); }
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════
   ACTIVE NAV HIGHLIGHT
════════════════════════════════════════ */
(function navHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.style.color = active ? 'var(--rose)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
})();

/* ══════════════════════════════════════
   PARALLAX — hero glyph on scroll
════════════════════════════════════════ */
(function glyphParallax() {
  const glyph = document.querySelector('.hero-glyph');
  if (!glyph) return;
  window.addEventListener('scroll', () => {
    glyph.style.transform = `translateY(${window.scrollY * 0.12}px) rotate(-3deg)`;
  }, { passive: true });
})();

/* ══════════════════════════════════════
   PHILOSOPHY PILLARS — stagger on scroll
════════════════════════════════════════ */
(function pillarStagger() {
  const pillars = document.querySelectorAll('.phil-pillar');
  pillars.forEach((p, i) => { p.style.transitionDelay = `${i * 0.1}s`; });
})();

/* ══════════════════════════════════════
   STORY LEFT — subtle parallax
════════════════════════════════════════ */
(function storyParallax() {
  const left = document.querySelector('.story-left');
  if (!left) return;
  window.addEventListener('scroll', () => {
    const rect = document.querySelector('.story').getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = -rect.top / window.innerHeight;
      left.style.transform = `translateY(${progress * 20}px)`;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════
   TICKER — pause on hover
════════════════════════════════════════ */
const tickerInner = document.querySelector('.ticker-inner');
if (tickerInner) {
  tickerInner.addEventListener('mouseenter', () => tickerInner.style.animationPlayState = 'paused');
  tickerInner.addEventListener('mouseleave', () => tickerInner.style.animationPlayState = 'running');
}

/* ══════════════════════════════════════
   FLOAT CARDS — mouse parallax on hero
════════════════════════════════════════ */
(function floatParallax() {
  const heroRight = document.querySelector('.hero-right');
  const cards = document.querySelectorAll('.float-card');
  if (!heroRight || !cards.length) return;

  heroRight.addEventListener('mousemove', e => {
    const rect = heroRight.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    cards.forEach((card, i) => {
      const depth = (i + 1) * 8;
      card.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  });
  heroRight.addEventListener('mouseleave', () => {
    cards.forEach(card => { card.style.transform = ''; });
  });
})();

console.log('%cArvee Law', 'color:#b8736a;font-size:2rem;font-family:"DM Serif Display",Georgia,serif;font-style:italic;');
console.log('%cEditorial v2 · Woman-Owned · Canada', 'color:#4a3520;font-size:0.85rem;');