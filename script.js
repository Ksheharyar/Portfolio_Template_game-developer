/* =========================================================
   MOHD SHEHARYAR — Portfolio JavaScript
   script.js
   ========================================================= */

'use strict';

// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

if (cursor && cursorTrail) {
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trail
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .gallery-item, .pillar, .skill-tag'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hovering');
      cursorTrail.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovering');
      cursorTrail.classList.remove('is-hovering');
    });
  });
}

// ── NAV — SCROLL BEHAVIOUR & ACTIVE STATE ──────────────────
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  // Scrolled state
  if (window.scrollY > 50) {
    nav.classList.add('is-scrolled');
  } else {
    nav.classList.remove('is-scrolled');
  }

  // Active link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── MOBILE NAV TOGGLE ──────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

// Create overlay
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

function openNav() {
  navLinksEl.classList.add('is-open');
  navToggle.classList.add('is-open');
  navOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  navLinksEl.classList.remove('is-open');
  navToggle.classList.remove('is-open');
  navOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinksEl.classList.contains('is-open') ? closeNav() : openNav();
  });
}
navOverlay.addEventListener('click', closeNav);
// Close on link click (mobile)
navLinksEl && navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeNav);
});

// ── INTERSECTION OBSERVER — REVEAL ANIMATIONS ──────────────
const revealEls = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Don't unobserve skill tags — they re-animate via CSS each time
      if (!entry.target.classList.contains('skills-layout')) {
        revealObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── EXPANDABLE BREAKDOWNS ──────────────────────────────────
function initToggle(buttonId, contentId) {
  const btn     = document.getElementById(buttonId);
  const content = document.getElementById(contentId);
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const isOpen = content.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen.toString());
  });
}

initToggle('swordedgeBreakdown', 'swordedgeBreakdownContent');

// ── CARD EXPANDABLE DETAILS ────────────────────────────────
document.querySelectorAll('.card-expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const detail   = document.getElementById(targetId);
    if (!detail) return;

    const isOpen = detail.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen.toString());

    // Update arrow text via aria-expanded CSS
    const arrow = btn.querySelector('.card-expand-arrow');
    if (arrow) arrow.textContent = isOpen ? '−' : '+';
  });
});

// ── TIMELINE EXPANDABLE ────────────────────────────────────
document.querySelectorAll('.timeline-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const detail   = document.getElementById(targetId);
    if (!detail) return;

    // Close others
    document.querySelectorAll('.timeline-detail.is-open').forEach(d => {
      if (d.id !== targetId) {
        d.classList.remove('is-open');
        const sibBtn = d.closest('.timeline-content')?.querySelector('.timeline-header');
        if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
      }
    });

    const isOpen = detail.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen.toString());
  });
});

// ── HERO PARTICLE CANVAS ───────────────────────────────────
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let W, H, particles = [];

  const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 14));
  const GOLD = 'rgba(201,168,76,';
  const CYAN = 'rgba(0,212,255,';

  function resize() {
    W = heroCanvas.width  = heroCanvas.offsetWidth;
    H = heroCanvas.height = heroCanvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.6 + 0.2);
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.6 + 0.2;
      this.fadeIn = true;
      this.color  = Math.random() > 0.7 ? CYAN : GOLD;
      this.life   = 0;
      this.maxLife= Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.fadeIn) {
        this.alpha = Math.min(this.alpha + 0.01, this.maxAlpha);
        if (this.alpha >= this.maxAlpha) this.fadeIn = false;
      }
      if (this.life > this.maxLife * 0.8) {
        this.alpha = Math.max(0, this.alpha - 0.008);
      }
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  let animFrame;
  function drawCanvas() {
    ctx.clearRect(0, 0, W, H);

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = GOLD + (0.05 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(drawCanvas);
  }

  function initCanvas() {
    resize();
    initParticles();
    cancelAnimationFrame(animFrame);
    drawCanvas();
  }

  initCanvas();
  window.addEventListener('resize', () => {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(initCanvas, 200);
  }, { passive: true });
}

// ── GALLERY LIGHTBOX ───────────────────────────────────────
function initLightbox() {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <span class="lightbox-close" role="button" aria-label="Close">✕</span>
    <img class="lightbox-img" src="" alt="Screenshot" />
  `;
  document.body.appendChild(overlay);

  const lbImg   = overlay.querySelector('.lightbox-img');
  const lbClose = overlay.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || 'Screenshot';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  // Attach to all gallery images
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lbClose.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
initLightbox();

// ── SMOOTH SCROLL for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = nav ? nav.offsetHeight + 20 : 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── SKILL TAG REANIMATION on scroll ───────────────────────
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
  let skillsAnimated = false;
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        document.querySelectorAll('.skill-tag').forEach((tag, i) => {
          // Stagger via inline style (the CSS animation reads --i)
          tag.style.animationPlayState = 'running';
        });
      }
    });
  }, { threshold: 0.15 });
  skillObserver.observe(skillsSection);
}

// ── VIDEO PLACEHOLDER click-to-embed ──────────────────────
// When you add real YouTube/Vimeo IDs, this handles click-to-load
document.querySelectorAll('.video-placeholder').forEach(placeholder => {
  const iframe = placeholder.querySelector('iframe');
  if (iframe) {
    // If there is a real iframe, wire up poster-click
    const inner = placeholder.querySelector('.video-placeholder-inner');
    if (inner) {
      inner.addEventListener('click', () => {
        iframe.src = iframe.src + '&autoplay=1';
        inner.style.display = 'none';
      });
    }
  }
});

// ── PARALLAX on hero grid (subtle) ───────────────────────
const heroGrid = document.querySelector('.hero-grid');
if (heroGrid) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroGrid.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  }, { passive: true });
}

// ── FOOTER YEAR (optional, future-proof) ─────────────────
const yearEl = document.querySelector('.footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── PAGE LOAD REVEAL ──────────────────────────────────────
window.addEventListener('load', () => {
  document.body.classList.add('is-loaded');
  // Trigger hero reveal elements immediately (they are in viewport)
  document.querySelectorAll('.hero .reveal-up').forEach(el => {
    el.classList.add('is-visible');
  });
});

console.log('%c[MS] Portfolio loaded — Gameplay Systems Developer', 'color:#c9a84c;font-family:monospace;font-size:13px;');
