/* =============================================
   DEEPAK TIWARI – PORTFOLIO SCRIPTS
   Phases 4-7: Motion system, scroll reveal, cursor,
   marquee, page load cascade, form handling.
   ============================================= */

/* -- DETECT MOTION PREFERENCE -- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {

  // -- 0. SMOOTH SCROLL (LENIS) --
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
  });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // -- 1. FOOTER YEAR --
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Clean up legacy dark mode
  localStorage.removeItem('dt-theme');
  document.documentElement.removeAttribute('data-theme');

  // -- 2. PAGE LOAD CASCADE (< 1.2s total) --
  if (!prefersReducedMotion) {
    const heroAvail = document.querySelector('.hero-availability-pill');
    const heroGreeting = document.querySelector('.hero-greeting-wrap');
    const heroSubline = document.querySelector('.hero-subline');
    const heroCtas = document.querySelector('.hero-ctas');
    const heroStats = document.querySelector('.hero-stats-strip');
    const heroStickers = document.querySelector('.hero-stickers-tray');
    const heroCluster = document.querySelector('.hero-cluster-col');

    const cascadeEls = [heroAvail, heroGreeting, heroSubline, heroCtas, heroStats, heroStickers, heroCluster].filter(Boolean);
    cascadeEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.35s cubic-bezier(0.2,0,0,1), transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 500 + i * 50);
    });
  }

  // -- 3. HERO HEADLINE WORD-POP (< 1.2s total) --
  if (!prefersReducedMotion) {
    const wordSplitEls = document.querySelectorAll('.hero-word-split');
    wordSplitEls.forEach((el, i) => {
      setTimeout(() => { el.classList.add('word-visible'); }, 200 + i * 70);
    });
    setTimeout(() => {
      document.querySelectorAll('.highlight-block').forEach(hb => hb.classList.add('is-visible'));
    }, 580);
  } else {
    document.querySelectorAll('.highlight-block').forEach(hb => hb.classList.add('is-visible'));
  }

  // -- 4. SCROLL PROGRESS BAR --
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    if (progressBar) progressBar.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // -- 5. BACK TO TOP & HEADER SCROLL --
  const backToTop = document.getElementById('back-to-top');
  const topHeader = document.getElementById('top-header');
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    if (topHeader) topHeader.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.2 }));
  }

  // -- 6. RIPPLE EFFECT --
  function addRipple(el) {
    el.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');
      ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size / 2) + 'px;top:' + (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }
  document.querySelectorAll('.btn-primary, .btn-ghost, .btn-contact, .btn-cv, .nb-btn').forEach(addRipple);

  // -- 7. PROFILE CARD GLOW --
  const profileCard = document.getElementById('profile-card');
  const cardGlow = document.getElementById('card-glow');
  if (profileCard && cardGlow) {
    profileCard.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      cardGlow.style.left = (e.clientX - rect.left) + 'px';
      cardGlow.style.top = (e.clientY - rect.top) + 'px';
    });
  }

  // -- 8. CUSTOM CURSOR (desktop fine-pointer only, never overlaps hero text at rest) --
  if (!isTouch && isFinePointer && !prefersReducedMotion) {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    let mx = -100, my = -100, ox = -100, oy = -100;
    let hasMoved = false;

    if (dot) dot.style.opacity = '0';
    if (outline) outline.style.opacity = '0';

    window.addEventListener('mousemove', e => {
      if (!hasMoved) {
        hasMoved = true;
        if (dot) dot.style.opacity = '1';
        if (outline) outline.style.opacity = '1';
      }
      mx = e.clientX; my = e.clientY;
      if (dot) dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    }, { passive: true });

    function trackOutline() {
      ox += (mx - ox) * 0.14;
      oy += (my - oy) * 0.14;
      if (outline) outline.style.transform = 'translate(' + ox + 'px,' + oy + 'px)';
      requestAnimationFrame(trackOutline);
    }
    requestAnimationFrame(trackOutline);

    document.addEventListener('mouseleave', () => {
      if (dot) dot.style.opacity = '0';
      if (outline) outline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (hasMoved) {
        if (dot) dot.style.opacity = '1';
        if (outline) outline.style.opacity = '1';
      }
    });

    const interactiveEls = document.querySelectorAll('a, button, .project-card, .cert-card, .about-card, .skill-chip, .nb-btn, .sticker, .draggable-sticker, .cluster-card');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (outline) outline.classList.add('cursor-hover');
        if (dot) dot.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        if (outline) outline.classList.remove('cursor-hover');
        if (dot && hasMoved) dot.style.opacity = '1';
      });
    });
  }

  // -- 9. SMOOTH ANCHOR SCROLL --
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.5, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    });
  });

  // -- 10. FLOATING NAV ACTIVE --
  const sections = document.querySelectorAll('.section[id]');
  const navItems = document.querySelectorAll('.fnav-item');

  function updateNav() {
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.45) current = sec.id;
    });
    navItems.forEach(item => item.classList.toggle('active', item.dataset.section === current));
  }
  let navTimer;
  window.addEventListener('scroll', () => {
    if (!navTimer) { navTimer = setTimeout(() => { updateNav(); navTimer = null; }, 100); }
  }, { passive: true });
  updateNav();

  // -- 12. SCROLL REVEAL WITH SIBLING STAGGER (80ms) --
  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      const byParent = new Map();
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const parent = entry.target.parentElement;
        if (!byParent.has(parent)) byParent.set(parent, []);
        byParent.get(parent).push(entry.target);
      });

      byParent.forEach((siblings) => {
        siblings.forEach((el, i) => {
          setTimeout(() => el.classList.add('revealed'), i * 80);
          revealObserver.unobserve(el);
        });
      });

      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('revealed')) {
          setTimeout(() => entry.target.classList.add('revealed'), 0);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-el').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal-el').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // -- 13. COUNT-UP STATS --
  function countUp(el, target, dur) {
    dur = dur || 1600;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    };
    requestAnimationFrame(step);
  }
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target, parseInt(entry.target.dataset.target));
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

  // -- 14. 3D TILT ON PROFILE CARD (subtle cursor tilt, max 6deg) --
  if (!isTouch && !prefersReducedMotion && profileCard) {
    profileCard.addEventListener('mousemove', e => {
      const r = profileCard.getBoundingClientRect();
      const rawRx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6;
      const rawRy = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6;
      const rx = Math.max(-6, Math.min(6, rawRx));
      const ry = Math.max(-6, Math.min(6, rawRy));
      profileCard.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      profileCard.style.transition = 'none';
    });
    profileCard.addEventListener('mouseleave', () => {
      profileCard.style.transform = '';
      profileCard.style.transition = 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1)';
    });
  }

  // -- 15. CONTACT FORM --
  const form = document.getElementById('contact-form');
  const btnText = document.getElementById('btn-text');
  const btnLoad = document.getElementById('btn-loading');
  const success = document.getElementById('form-success');
  const formError = document.getElementById('form-error');
  const nameInput = document.getElementById('cf-name');
  const emailInput = document.getElementById('cf-email');
  const msgInput = document.getElementById('cf-message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const msgError = document.getElementById('message-error');

  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}';
  document.head.appendChild(shakeStyle);

  function clearFieldError(input, errorEl) {
    if (input) { input.classList.remove('is-invalid'); input.removeAttribute('aria-invalid'); }
    if (errorEl) errorEl.classList.add('hidden');
  }

  if (nameInput) nameInput.addEventListener('input', () => clearFieldError(nameInput, nameError));
  if (emailInput) emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
  if (msgInput) msgInput.addEventListener('input', () => clearFieldError(msgInput, msgError));

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let hasError = false, firstInvalid = null;

      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) { nameInput.classList.add('is-invalid'); nameInput.setAttribute('aria-invalid', 'true'); }
        if (nameError) nameError.classList.remove('hidden');
        hasError = true; if (!firstInvalid) firstInvalid = nameInput;
      } else clearFieldError(nameInput, nameError);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        if (emailInput) { emailInput.classList.add('is-invalid'); emailInput.setAttribute('aria-invalid', 'true'); }
        if (emailError) emailError.classList.remove('hidden');
        hasError = true; if (!firstInvalid) firstInvalid = emailInput;
      } else clearFieldError(emailInput, emailError);

      if (!msgInput || !msgInput.value.trim()) {
        if (msgInput) { msgInput.classList.add('is-invalid'); msgInput.setAttribute('aria-invalid', 'true'); }
        if (msgError) msgError.classList.remove('hidden');
        hasError = true; if (!firstInvalid) firstInvalid = msgInput;
      } else clearFieldError(msgInput, msgError);

      if (hasError) {
        if (formError) formError.classList.add('hidden');
        form.style.animation = 'shake .4s ease';
        form.addEventListener('animationend', () => { form.style.animation = ''; }, { once: true });
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (formError) formError.classList.add('hidden');
      if (btnText) btnText.classList.add('hidden');
      if (btnLoad) btnLoad.classList.remove('hidden');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(res => {
          if (btnText) btnText.classList.remove('hidden');
          if (btnLoad) btnLoad.classList.add('hidden');
          if (res.ok) {
            if (success) {
              success.classList.remove('hidden');
              setTimeout(() => success.classList.add('hidden'), 7000);
            }
            form.reset();
            clearFieldError(nameInput, nameError);
            clearFieldError(emailInput, emailError);
            clearFieldError(msgInput, msgError);
          } else throw new Error('Form submission failed');
        })
        .catch(() => {
          if (btnText) btnText.classList.remove('hidden');
          if (btnLoad) btnLoad.classList.add('hidden');
          if (formError) formError.classList.remove('hidden');
        });
    });
  }

  // -- 16. ROLE CYCLER --
  const words = document.querySelectorAll('.rw');
  if (words.length) {
    let current = 0;
    function cycle() {
      const prev = current;
      current = (current + 1) % words.length;
      words[prev].classList.remove('active');
      words[prev].classList.add('exit');
      words[current].classList.remove('exit');
      words[current].classList.add('active');
      setTimeout(() => words[prev].classList.remove('exit'), 1000);
    }
    setInterval(cycle, 3000);
  }

  // -- 17. STAT CARD HOVER PULSE --
  if (!prefersReducedMotion) {
    document.querySelectorAll('.bento-card.stat-bento').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const num = card.querySelector('.stat-num');
        if (num) {
          num.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
          num.style.transform = 'scale(1.15)';
        }
      });
      card.addEventListener('mouseleave', () => {
        const num = card.querySelector('.stat-num');
        if (num) num.style.transform = 'scale(1)';
      });
    });
  }

  // -- 18. PARALLAX SCROLLING ENGINE --
  if (!prefersReducedMotion && !isTouch) {
    const parallaxEls = [];
    function initParallax() {
      parallaxEls.length = 0;
      document.querySelectorAll('[data-parallax]').forEach(el => {
        parallaxEls.push({ el: el, speed: parseFloat(el.getAttribute('data-parallax')) || 0.1 });
      });
    }
    initParallax();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initParallax, 250);
    }, { passive: true });

    let parallaxTicking = false;
    function applyParallax() {
      const viewH = window.innerHeight;
      parallaxEls.forEach(function (item) {
        const el = item.el, speed = item.speed;
        if (el.classList.contains('reveal-el') && !el.classList.contains('revealed')) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -400 || rect.top > viewH + 400) return;
        const offset = -((rect.top + rect.height / 2 - viewH / 2) * speed);
        el.style.setProperty('--py', offset + 'px');
      });
      parallaxTicking = false;
    }
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) { requestAnimationFrame(applyParallax); parallaxTicking = true; }
    }, { passive: true });
    requestAnimationFrame(applyParallax);
  }

  // -- 19. HIGHLIGHT BLOCK DRAW-IN --
  if (!prefersReducedMotion) {
    const hbObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          hbObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.highlight-block').forEach(el => hbObserver.observe(el));
  } else {
    document.querySelectorAll('.highlight-block').forEach(el => el.classList.add('is-visible'));
  }

  // -- 20. CERT CARD WIGGLE RESET --
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('animationend', () => { card.style.animation = ''; });
  });

}); // end DOMContentLoaded

/* -- MOBILE NAV DRAWER -- */
(function () {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileClose = document.getElementById('mobile-nav-close');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const mobileCtas = document.querySelectorAll('.mobile-nav-cta');

  if (!hamburgerBtn || !mobileOverlay) return;

  function openMobileNav() {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileOverlay.style.display = 'block';
    mobileOverlay.getBoundingClientRect();
    mobileOverlay.classList.add('open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    mobileNavItems.forEach((item, index) => {
      setTimeout(() => {
        if (mobileOverlay.classList.contains('open')) item.classList.add('stagger-in');
      }, index * 50);
    });
  }

  function closeMobileNav() {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileOverlay.classList.remove('open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    mobileNavItems.forEach(item => item.classList.remove('stagger-in'));
    setTimeout(() => {
      if (!mobileOverlay.classList.contains('open')) mobileOverlay.style.display = 'none';
    }, 400);
  }

  hamburgerBtn.addEventListener('click', () => {
    mobileOverlay.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });

  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) closeMobileNav();
  });

  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      closeMobileNav();
      mobileNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  mobileCtas.forEach(cta => { cta.addEventListener('click', () => closeMobileNav()); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) {
      closeMobileNav();
      hamburgerBtn.focus();
    }
  });

  const sections = document.querySelectorAll('.section[id]');
  function updateMobileNavActive() {
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.45) current = sec.id;
    });
    mobileNavItems.forEach(item => item.classList.toggle('active', item.dataset.section === current));
  }
  window.addEventListener('scroll', updateMobileNavActive, { passive: true });
  updateMobileNavActive();
  mobileOverlay.style.display = 'none';
})();

/* ============================================================
   TOP 1% ADVANCED STUDIO SUITE ENGINES
   ============================================================ */

// -- 1. LIVE TIMEZONE CLOCK ENGINE (Mumbai · HH:MM - no seconds) --
(function initLiveTimezoneClock() {
  const clockEls = [
    document.getElementById('hero-live-clock'),
    document.getElementById('live-ist-clock')
  ].filter(Boolean);
  if (!clockEls.length) return;

  function updateClock() {
    try {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);
      clockEls.forEach(el => {
        el.textContent = 'Mumbai · ' + timeStr;
      });
    } catch (e) {
      clockEls.forEach(el => {
        el.textContent = 'Mumbai · Active';
      });
    }
  }
  updateClock();
  setInterval(updateClock, 1000 * 30);
})();

// -- 1B. DRAGGABLE STICKER PILLS ENGINE (Idle float & pointer drag-to-move) --
(function initDraggableStickers() {
  const stickers = document.querySelectorAll('.draggable-sticker');
  if (!stickers.length) return;

  stickers.forEach(sticker => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;

    sticker.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDragging = true;
      try { sticker.setPointerCapture(e.pointerId); } catch (_) {}
      sticker.classList.add('is-dragging');
      sticker.classList.remove('float-idle');

      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      e.preventDefault();
    });

    sticker.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      sticker.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.08) rotate(var(--tilt, 0deg))`;
    });

    function stopDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      try { sticker.releasePointerCapture(e.pointerId); } catch (_) {}
      sticker.classList.remove('is-dragging');
      sticker.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(var(--tilt, 0deg))`;
    }

    sticker.addEventListener('pointerup', stopDrag);
    sticker.addEventListener('pointercancel', stopDrag);
  });
})();

// -- 2. DUAL-THEME SWITCHER ENGINE (STUDIO DARK MODE) --
(function initThemeSwitcher() {
  const toggleBtns = [
    document.getElementById('theme-toggle-btn'),
    document.getElementById('mobile-theme-toggle-btn')
  ].filter(Boolean);

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const savedTheme = localStorage.getItem('dt-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dt-theme', theme);
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#141412' : '#FAF7F2');
    }
  }

  applyTheme(savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });
})();

// -- 3. INTERACTIVE DESIGN SYSTEM PLAYGROUND --
(function initDesignSystemSandbox() {
  const card = document.getElementById('ds-interactive-card');
  if (!card) return;

  // Radius controls
  const radiusBtns = document.querySelectorAll('#ds-radius-group .ds-pill');
  radiusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      radiusBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      card.style.borderRadius = btn.dataset.radius;
    });
  });

  // Elevation controls
  const elevationBtns = document.querySelectorAll('#ds-elevation-group .ds-pill');
  elevationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elevationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.shadow;
      if (mode === 'neo') {
        card.style.boxShadow = '6px 6px 0 var(--ink)';
      } else if (mode === 'soft') {
        card.style.boxShadow = '0 16px 32px rgba(20, 20, 18, 0.16)';
      } else {
        card.style.boxShadow = 'none';
      }
    });
  });

  // Color Swatches
  const colorBtns = document.querySelectorAll('#ds-color-group .ds-swatch');
  const colorMap = {
    yellow: '#FFE566',
    mint: '#B4F0CE',
    lavender: '#DDD2FE',
    blue: '#2B3DF0'
  };

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const color = btn.dataset.color;
      card.style.background = colorMap[color] || '#FFE566';
      if (color === 'blue') {
        card.style.color = '#FFFFFF';
        const cardTitle = card.querySelector('.ds-card-title');
        const cardText = card.querySelector('.ds-card-text');
        if (cardTitle) cardTitle.style.color = '#FFFFFF';
        if (cardText) cardText.style.color = '#FFFFFF';
      } else {
        card.style.color = '#141412';
        const cardTitle = card.querySelector('.ds-card-title');
        const cardText = card.querySelector('.ds-card-text');
        if (cardTitle) cardTitle.style.color = '#141412';
        if (cardText) cardText.style.color = '#141412';
      }
    });
  });
})();

// -- 4. SPRING MAGNETIC ATTRACTION ENGINE --
(function initMagneticItems() {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReduced) return;

  const magneticTargets = document.querySelectorAll('.magnetic-item, .fnav-item, .footer-social-btn, .project-arrow, .theme-toggle-btn');
  magneticTargets.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();