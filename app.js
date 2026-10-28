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

  // -- 0. RAPID SCROLL PERFORMANCE (Smooth scrolling disabled for immediate response) --

  // -- 1. FOOTER YEAR --
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -- 2. PAGE LOAD CASCADE (< 1.2s total) --
  if (!prefersReducedMotion) {
    const heroAvail = document.querySelector('.hero-availability-pill');
    const heroGreeting = document.querySelector('.hero-greeting-wrap');
    const heroSubline = document.querySelector('.hero-subline');
    const heroCtas = document.querySelector('.hero-ctas');
    const heroCluster = document.querySelector('.hero-cluster-col');

    const cascadeEls = [heroAvail, heroGreeting, heroSubline, heroCtas, heroCluster].filter(Boolean);
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

  // -- HERO GREETING SEQUENTIAL ANIMATION ("Namaste" -> "Hi, I am Deepak Tiwari") --
  (function initHeroGreetingAnimation() {
    const namasteEl = document.getElementById('greeting-namaste');
    const hiEl = document.getElementById('greeting-hi');
    if (!namasteEl || !hiEl) return;

    let isNamaste = true;

    function transitionGreeting() {
      if (isNamaste) {
        // Transition from Namaste to Hi, I am Deepak Tiwari
        namasteEl.classList.remove('is-active');
        namasteEl.classList.add('is-leaving');
        setTimeout(() => {
          namasteEl.classList.remove('is-leaving');
          hiEl.classList.remove('is-leaving');
          hiEl.classList.add('is-active');
          isNamaste = false;
        }, 260);
      } else {
        // Transition back to Namaste
        hiEl.classList.remove('is-active');
        hiEl.classList.add('is-leaving');
        setTimeout(() => {
          hiEl.classList.remove('is-leaving');
          namasteEl.classList.remove('is-leaving');
          namasteEl.classList.add('is-active');
          isNamaste = true;
        }, 260);
      }
    }

    // On page opening: Show "Namaste 🙏" first, then transition to "Hi, I am Deepak Tiwari 👋" after 3.2s
    setTimeout(() => {
      transitionGreeting();
      // Continue periodic smooth sequence so visitors see both greetings
      setInterval(transitionGreeting, 5000);
    }, 3200);
  })();

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
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
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

  // -- 8. PREMIUM NEO-BRUTALIST CUSTOM CURSOR DESIGN --
  if (!isTouch && isFinePointer && !prefersReducedMotion) {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    const badge = document.getElementById('cursor-badge');

    if (dot && outline) {
      let mx = -100, my = -100;
      let isVisible = false;
      let isMouseDown = false;

      dot.style.opacity = '0';
      outline.style.opacity = '0';

      function updateCursorPosition(x, y) {
        const dotScale = isMouseDown ? ' scale(0.6)' : '';
        const outlineScale = isMouseDown ? ' scale(0.85)' : '';
        dot.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) translate(-50%, -50%)' + dotScale;
        outline.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) translate(-50%, -50%)' + outlineScale;
      }

      window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;

        if (!isVisible) {
          isVisible = true;
          dot.style.opacity = '1';
          outline.style.opacity = '1';
        }

        updateCursorPosition(mx, my);
      }, { passive: true });

      // Window boundary awareness
      document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        outline.style.opacity = '0';
        isVisible = false;
      });

      document.addEventListener('mouseenter', () => {
        if (isVisible) {
          dot.style.opacity = '1';
          outline.style.opacity = '1';
        }
      });

      // Mousedown tactile snap feedback (instant response)
      window.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          isMouseDown = true;
          dot.classList.add('cursor-active');
          outline.classList.add('cursor-active');
          if (isVisible) updateCursorPosition(mx, my);
        }
      });

      window.addEventListener('mouseup', () => {
        isMouseDown = false;
        dot.classList.remove('cursor-active');
        outline.classList.remove('cursor-active');
        if (isVisible) updateCursorPosition(mx, my);
      });

      // Contextual state: Project cards / Featured Case Studies
      const viewTargets = document.querySelectorAll(
        '.project-card, .cluster-card, .featured-case-card, .case-study-progress-pill, .hero-project-cluster a, .visual-work-card'
      );
      viewTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
          outline.classList.add('cursor-view');
          dot.classList.add('cursor-hidden');
          if (badge) badge.textContent = 'VIEW ↗';
        });
        el.addEventListener('mouseleave', () => {
          outline.classList.remove('cursor-view');
          dot.classList.remove('cursor-hidden');
          if (badge) badge.textContent = '';
        });
      });

      // Contextual state: Peelable Stickers / Draggable items
      const dragTargets = document.querySelectorAll(
        '.sticker, .draggable-sticker, .skill-tool-pill'
      );
      dragTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
          outline.classList.add('cursor-drag');
          dot.classList.add('cursor-hidden');
          if (badge) badge.textContent = 'PEEL ✦';
        });
        el.addEventListener('mouseleave', () => {
          outline.classList.remove('cursor-drag');
          dot.classList.remove('cursor-hidden');
          if (badge) badge.textContent = '';
        });
      });

      // Contextual state: Standard links & buttons
      const hoverTargets = document.querySelectorAll(
        'a:not(.cluster-card):not(.project-card):not(.visual-work-card), button, .nb-btn, .fnav-item, .magnetic-item, .cert-card, .about-card, [role="button"]:not(.skill-tool-pill)'
      );
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
          if (!outline.classList.contains('cursor-view') && !outline.classList.contains('cursor-drag')) {
            outline.classList.add('cursor-hover');
            dot.classList.add('cursor-hover');
          }
        });
        el.addEventListener('mouseleave', () => {
          outline.classList.remove('cursor-hover');
          dot.classList.remove('cursor-hover');
        });
      });
    }
  }

  // -- 9. RAPID ANCHOR NAVIGATION (Smooth scrolling disabled for instant response) --
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // Instantaneous rapid response scroll
      target.scrollIntoView({ behavior: 'auto' });
      if (history.pushState) {
        history.pushState(null, null, id);
      }
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
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && mobileOverlay.classList.contains('open')) {
      closeMobileNav();
    }
  });
  updateMobileNavActive();
  mobileOverlay.style.display = 'none';
  document.body.style.overflow = '';
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

// ============================================================
// -- 5. EXPERIENCE TIMELINE & INTERACTION ENGINES --
// ============================================================
(function initExperienceEngines() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. DURATION AUTO-CALCULATION & COUNT-UP
  const durationEls = document.querySelectorAll('.exp-duration');
  function calcMonths(startStr, endStr) {
    if (!startStr) return 1;
    const start = new Date(startStr);
    const end = (endStr === 'present' || !endStr) ? new Date() : new Date(endStr);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    return Math.max(1, months);
  }

  function formatDuration(months) {
    if (months >= 12) {
      const yrs = Math.floor(months / 12);
      const rem = months % 12;
      return rem > 0 ? `${yrs} yr ${rem} mos` : `${yrs} yr${yrs > 1 ? 's' : ''}`;
    }
    return `${months} mos`;
  }

  if (prefersReduced) {
    durationEls.forEach(el => {
      const totalMonths = calcMonths(el.dataset.start, el.dataset.end);
      el.textContent = formatDuration(totalMonths);
    });
  } else {
    const durObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          durObserver.unobserve(el);
          const totalMonths = calcMonths(el.dataset.start, el.dataset.end);
          const animDur = 850;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / animDur, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentMonths = Math.max(1, Math.round(ease * totalMonths));
            el.textContent = formatDuration(currentMonths);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = formatDuration(totalMonths);
            }
          }
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.5 });

    durationEls.forEach(el => durObserver.observe(el));
  }

  // 2. TIMELINE SCROLL PROGRESS FILL & TRAVELING STICKER MARKER
  const timeline = document.getElementById('exp-timeline');
  const trackFill = document.getElementById('timeline-track-fill');
  const marker = document.getElementById('timeline-marker');
  const nodes = document.querySelectorAll('.tl-node');

  if (timeline && trackFill) {
    function updateTimelineProgress() {
      const rect = timeline.getBoundingClientRect();
      const winH = window.innerHeight;
      const startTrigger = winH * 0.7;
      const progress = (startTrigger - rect.top) / rect.height;
      const clamped = Math.min(Math.max(progress, 0), 1);
      const pct = (clamped * 100).toFixed(1);

      trackFill.style.height = pct + '%';
      if (marker) {
        marker.style.top = pct + '%';
      }

      const fillBottomY = rect.top + (rect.height * clamped);
      nodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        const nodeCenterY = nodeRect.top + nodeRect.height / 2;
        if (nodeCenterY <= fillBottomY + 12) {
          node.classList.add('node-reached');
        } else {
          node.classList.remove('node-reached');
        }
      });
    }

    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress, { passive: true });
    updateTimelineProgress();
  }

  // 3. EXPAND / COLLAPSE PER CARD WITH KEYBOARD ACCESSIBILITY
  const collapseBtns = document.querySelectorAll('.exp-collapse-btn');
  collapseBtns.forEach(btn => {
    const targetId = btn.getAttribute('aria-controls');
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    function toggleDetails() {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        targetEl.style.maxHeight = targetEl.scrollHeight + 'px';
        targetEl.offsetHeight; // force reflow
        targetEl.classList.add('is-collapsed');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        targetEl.classList.remove('is-collapsed');
        targetEl.style.maxHeight = targetEl.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
          if (btn.getAttribute('aria-expanded') === 'true') {
            targetEl.style.maxHeight = '';
          }
        }, 400);
      }
    }

    btn.addEventListener('click', toggleDetails);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDetails();
      }
    });
  });
})();

// ============================================================
// -- 6. NEO-BRUTALIST FEATURED WORK ENGINE --
// ============================================================
(function initFeaturedWorkEngine() {
  /**
   * SINGLE PROJECT DATA ARRAY
   * Edit portfolio project copy, metrics, and links here directly.
   * If any field is empty or contains '[PLACEHOLDER', it will NOT render in the UI.
   */
  const PORTFOLIO_PROJECTS = [
    {
      id: 'ola-partner',
      number: '01',
      tier: 'selected', // 'selected' | 'more-product' | 'visual'
      category: 'product', // 'product' | 'web' | 'visual'
      type: 'Concept case study',
      title: 'Ola Partner: Driver Retention Redesign',
      problem: 'High driver churn during peak traffic caused by cluttered acceptance flows and poor sunlight visibility.',
      role: 'Product Designer',
      duration: '3 months',
      platform: 'Android (Driver)',
      year: '2024',
      proof: 'Tested with 14 commercial drivers in Mumbai; 1-tap accept cut response time by 42%.',
      metric: '+18% Retention', // Only rendered if filled; omitted if empty or [PLACEHOLDER]
      cta: 'Read case study',
      link: 'https://flute-beluga-59087359.figma.site/',
      isExternal: true,
      colorScheme: 'yellow',
      imageWebp: 'ola_partner_preview.webp',
      imageFallback: 'ola_partner_preview.png',
      imageAlt: 'Ola Partner - Driver Retention & Usability Case Study',
      tilt: '-0.6deg',
      isLead: true
    },
    {
      id: 'indigo-booking',
      number: '02',
      tier: 'selected',
      category: 'product',
      type: 'Concept case study',
      title: 'IndiGo: Frictionless Flight Booking Flow',
      problem: 'Complex fare tiers and hidden add-on steps caused high drop-offs before checkout.',
      role: 'UX Researcher & Designer',
      duration: '6 weeks',
      platform: 'Mobile Web',
      year: '2024',
      proof: 'Streamlined 7-step booking funnel into 4 intuitive decision stages with zero surprise fees.',
      metric: '', // No metric rendered if empty
      cta: 'Read case study',
      link: 'https://indigocase-study.my.canva.site/copy-of-case-study-template-website-based-on-study',
      isExternal: true,
      colorScheme: 'mint',
      imageFallback: 'https://images.pexels.com/photos/13328092/pexels-photo-13328092.png?auto=compress&cs=tinysrgb&w=800',
      imageAlt: 'IndiGo Flight Booking Flow UX Case Study',
      tilt: '0.8deg',
      isLead: false
    },
    {
      id: 'kanban-tracker',
      number: '03',
      tier: 'selected',
      category: 'web',
      type: 'Web app',
      title: 'Kanban Tracker: Distraction-Free Workflow OS',
      problem: 'Team productivity tools suffer from feature bloat that slows daily agile sprint tracking.',
      role: 'UI Designer & Frontend',
      duration: '4 weeks',
      platform: 'Web / PWA',
      year: '2024',
      proof: 'Keyboard-first interaction model with sub-100ms task updates and offline-first state.',
      metric: '',
      cta: 'Read case study',
      link: 'https://www.behance.net/gallery/235653015',
      isExternal: true,
      colorScheme: 'lavender',
      imageFallback: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/30b3a7235653015.Y3JvcCwyOTQzLDIzMDIsMTQsMA.png',
      imageAlt: 'Kanban Task Management Web Application',
      tilt: '-0.7deg',
      isLead: false
    },
    {
      id: 'yoga-wellness',
      number: '04',
      tier: 'more-product',
      category: 'web',
      type: 'Client project',
      title: 'Holistic Yoga: High-Converting Class Booking',
      problem: 'Holistic studio needed a frictionless booking schedule for recurring members and drop-ins.',
      role: 'UI/UX Designer',
      duration: '3 weeks',
      platform: 'Responsive Web',
      year: '2024',
      proof: 'Accessible 2-step reservation schedule with live instructor availability preview.',
      metric: '',
      cta: 'Read case study',
      link: 'https://www.behance.net/gallery/235520313',
      isExternal: true,
      colorScheme: 'pink',
      imageFallback: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/364589235520313.Y3JvcCwxNTM0MSwxMjAwMCwzNDEsMA.png',
      imageAlt: 'Yoga and Wellness Platform Landing Page',
      tilt: '0.5deg',
      isLead: false
    },
    {
      id: 'dominos-campaign',
      number: '05',
      tier: 'visual',
      category: 'visual',
      type: 'Client project',
      title: 'Domino’s: Appetite-Appeal Social & Print Visuals',
      problem: 'Digital promotional posters needed higher thumb-stop visual hierarchy across social channels.',
      role: 'Visual Designer',
      duration: '2 weeks',
      platform: 'Print & Social',
      year: '2024',
      proof: 'Bold neo-pop typography system paired with dynamic high-contrast product staging.',
      metric: '',
      cta: 'Read case study',
      link: 'https://www.behance.net/gallery/214354057',
      isExternal: true,
      colorScheme: 'cream',
      imageFallback: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/8e2424214354057.Y3JvcCwzMzc1LDI2MzksMCwzNjc.png',
      imageAlt: 'Domino’s Pizza Brand Promotional Campaign Poster',
      tilt: '0deg',
      isLead: false
    },
    {
      id: 'gourmet-burger',
      number: '06',
      tier: 'visual',
      category: 'visual',
      type: 'Client project',
      title: 'Gourmet Burger: Artisanal Brand Identity & Packaging',
      problem: 'Craft burger brand needed distinct identity guidelines to stand out in saturated market.',
      role: 'Brand & Visual Designer',
      duration: '3 weeks',
      platform: 'Identity & Print',
      year: '2024',
      proof: 'End-to-end packaging identity suite with custom brand illustrations and menu design.',
      metric: '',
      cta: 'Read case study',
      link: 'https://www.behance.net/gallery/214274261',
      isExternal: true,
      colorScheme: 'lavender',
      imageFallback: 'https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/ee571d214274261.Y3JvcCwzMzc1LDI2MzksMCwzNjc.png',
      imageAlt: 'Gourmet Burger Brand Identity and Promotional Poster',
      tilt: '0deg',
      isLead: false
    }
  ];

  // Expose to window for user console inspectability
  window.PORTFOLIO_PROJECTS = PORTFOLIO_PROJECTS;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  // 1. SCROLL STICKER "SLAP" IN ANIMATION
  const slapCards = document.querySelectorAll('.sticker-slap');
  if (prefersReduced) {
    slapCards.forEach(c => c.classList.add('is-slapped'));
  } else if ('IntersectionObserver' in window) {
    const slapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          slapObserver.unobserve(entry.target);
          setTimeout(() => {
            entry.target.classList.add('is-slapped');
          }, idx * 100);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    slapCards.forEach(card => slapObserver.observe(card));
  } else {
    slapCards.forEach(c => c.classList.add('is-slapped'));
  }

  // 2. LEAD CARD: 3D CURSOR-FOLLOWING TILT, GLARE & COVER PARALLAX
  const leadCard = document.querySelector('.project-lead-split');
  if (leadCard && isFinePointer && !prefersReduced) {
    const glareEl = leadCard.querySelector('.card-cover-glare');
    const previewFrame = leadCard.querySelector('.ola-preview-frame');
    const coverImg = leadCard.querySelector('.card-cover-img');
    let rafId = null;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    function renderTilt() {
      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;
      leadCard.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

      if (previewFrame) {
        const px = (currentRotY * 1.6).toFixed(1);
        const py = (-currentRotX * 1.6).toFixed(1);
        previewFrame.style.transform = `translate(${px}px, ${py}px) scale(1.02)`;
      } else if (coverImg) {
        const px = (-currentRotY * 1.5).toFixed(1);
        const py = (currentRotX * 1.5).toFixed(1);
        coverImg.style.transform = `scale(1.06) translate(${px}px, ${py}px)`;
      }

      if (Math.abs(targetRotX - currentRotX) > 0.01 || Math.abs(targetRotY - currentRotY) > 0.01) {
        rafId = requestAnimationFrame(renderTilt);
      } else {
        rafId = null;
      }
    }

    leadCard.addEventListener('mousemove', (e) => {
      const rect = leadCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const normX = (x - cx) / cx;
      const normY = (y - cy) / cy;

      // Max 5deg tilt
      targetRotX = -normY * 4.5;
      targetRotY = normX * 4.5;

      if (glareEl) {
        glareEl.style.opacity = '0.35';
        glareEl.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`;
      }

      if (!rafId) {
        rafId = requestAnimationFrame(renderTilt);
      }
    });

    leadCard.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
      if (glareEl) glareEl.style.opacity = '0';
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          leadCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          if (previewFrame) previewFrame.style.transform = 'translate(0px, 0px) scale(1)';
          else if (coverImg) coverImg.style.transform = 'scale(1) translate(0px, 0px)';
        });
      }
    });
  }

  // 3. CUSTOM CURSOR LABEL "View case study" OVER CARDS (Fine pointers only)
  if (isFinePointer && !prefersReduced) {
    let cursorLabel = document.getElementById('neo-card-cursor-pill');
    if (!cursorLabel) {
      cursorLabel = document.createElement('div');
      cursorLabel.id = 'neo-card-cursor-pill';
      cursorLabel.className = 'neo-card-cursor-pill';
      cursorLabel.setAttribute('aria-hidden', 'true');
      cursorLabel.innerHTML = 'View case study &nearr;';
      document.body.appendChild(cursorLabel);
    }

    let cursorX = -100;
    let cursorY = -100;

    window.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorLabel.style.left = cursorX + 'px';
      cursorLabel.style.top = cursorY + 'px';
    }, { passive: true });

    const cardTargets = document.querySelectorAll('.neo-project-card, .visual-strip-item');
    cardTargets.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursorLabel.classList.add('is-active');
      });
      card.addEventListener('mouseleave', () => {
        cursorLabel.classList.remove('is-active');
      });
    });
  }

  // 4. DESKTOP STACKED STICKY PROGRESS INDICATOR ("01 / 04")
  const counterEl = document.getElementById('cs-active-idx');
  const leadCardEl = document.querySelector('.project-lead-split');
  const cardIndigoEl = document.querySelector('[data-card-idx="2"]');
  const cardKanbanEl = document.querySelector('[data-card-idx="3"]');
  const cardYogaEl = document.querySelector('[data-card-idx="4"]');

  if (counterEl && leadCardEl && cardIndigoEl) {
    function updateStickyCounter() {
      // Only active on desktop when sticky is effective
      if (window.innerWidth <= 860) {
        counterEl.textContent = '01';
        return;
      }

      const yogaRect = cardYogaEl ? cardYogaEl.getBoundingClientRect() : null;
      const kanbanRect = cardKanbanEl ? cardKanbanEl.getBoundingClientRect() : null;
      const indigoRect = cardIndigoEl.getBoundingClientRect();
      const leadRect = leadCardEl.getBoundingClientRect();

      if (yogaRect && yogaRect.top <= 160 && yogaRect.bottom > 180) {
        counterEl.textContent = '04';
      } else if (kanbanRect && kanbanRect.top <= 160 && kanbanRect.bottom > 180) {
        counterEl.textContent = '03';
      } else if (indigoRect.top <= 160 && indigoRect.bottom > 180) {
        counterEl.textContent = '02';
      } else {
        counterEl.textContent = '01';
      }
    }

    window.addEventListener('scroll', updateStickyCounter, { passive: true });
    window.addEventListener('resize', updateStickyCounter, { passive: true });
    updateStickyCounter();
  }

  // 5. PILL FILTER WITH FLIP REFLOW ANIMATION
  const filterPills = document.querySelectorAll('.projects-filter-bar .filter-pill');
  const allCards = document.querySelectorAll('.neo-project-card, .visual-strip-container');
  const tiers = document.querySelectorAll('.projects-tier');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetCategory = pill.getAttribute('data-filter');

      // Update active pill
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      // FLIP: FIRST
      const firstRects = new Map();
      allCards.forEach(card => {
        if (!card.classList.contains('is-filtered-out')) {
          firstRects.set(card, card.getBoundingClientRect());
        }
      });

      // APPLY FILTER
      allCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        const match = targetCategory === 'all' || cardCat === targetCategory;
        if (match) {
          card.classList.remove('is-filtered-out');
        } else {
          card.classList.add('is-filtered-out');
        }
      });

      // Show / hide tiers if all cards inside tier are filtered out
      tiers.forEach(tier => {
        const visibleChild = tier.querySelector('.neo-project-card:not(.is-filtered-out), .visual-strip-container:not(.is-filtered-out)');
        if (visibleChild) {
          tier.classList.remove('is-filtered-out');
        } else {
          tier.classList.add('is-filtered-out');
        }
      });

      if (prefersReduced) return;

      // FLIP: LAST, INVERT & PLAY
      allCards.forEach(card => {
        if (!card.classList.contains('is-filtered-out') && firstRects.has(card)) {
          const first = firstRects.get(card);
          const last = card.getBoundingClientRect();
          const dx = first.left - last.left;
          const dy = first.top - last.top;

          if (dx !== 0 || dy !== 0) {
            card.style.transform = `translate(${dx}px, ${dy}px)`;
            card.style.transition = 'none';

            requestAnimationFrame(() => {
              card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
              card.style.transform = '';
            });
          }
        }
      });
    });
  });
})();

// ============================================================
// -- 7. HOW I SHIP (SKILLS & TOOL STACK) ENGINE --
// ============================================================
(function initSkillsEngine() {
  /**
   * SINGLE TOOL STACK DATA OBJECT
   * Easily edit tool descriptions, workflow stages, and tooltips here.
   */
  const TOOL_STACK_DATA = {
    design: {
      title: "Design & prototype",
      desc: "High-fidelity component systems, micro-interactions, and dev-ready flows.",
      color: "yellow",
      tools: [
        { id: "figma", name: "Figma", size: "lg", usage: "Daily", stages: ["design", "prototype", "handoff"], tooltip: "Dev-ready design systems & multi-screen app flows" },
        { id: "framer", name: "Framer", size: "md", usage: "Regular", stages: ["design", "prototype", "build"], tooltip: "Interactive production prototypes & motion logic" },
        { id: "canva", name: "Canva", size: "md", usage: "Regular", stages: ["design"], tooltip: "Fast collateral layout, deck graphics & assets" }
      ]
    },
    process: {
      title: "Process skills",
      desc: "Evidence-based problem framing from user discovery to validated usability.",
      color: "mint",
      tools: [
        { id: "ux-research", name: "UX research", size: "lg", usage: "Daily", stages: ["discover", "define"], tooltip: "User interviews, contextual inquiry & journey maps" },
        { id: "wireframing", name: "Wireframing", size: "md", usage: "Daily", stages: ["define", "design"], tooltip: "Low-fidelity structural flows & layout architecture" },
        { id: "prototyping", name: "Prototyping", size: "lg", usage: "Daily", stages: ["design", "prototype"], tooltip: "Clickable validation rigs for concept validation" },
        { id: "design-systems", name: "Design systems", size: "md", usage: "Regular", stages: ["design", "handoff", "build"], tooltip: "Tokenized UI kits, auto-layout & state guidelines" },
        { id: "usability-testing", name: "Usability testing", size: "md", usage: "Regular", stages: ["discover", "prototype"], tooltip: "Moderated task tests, heuristic audits & fix sprints" }
      ]
    },
    ai: {
      title: "AI in my workflow",
      desc: "Accelerating research synthesis, rapid ideation, and documentation velocity.",
      color: "lavender",
      tools: [
        { id: "claude", name: "Claude", size: "lg", usage: "Daily", stages: ["discover", "define", "build"], tooltip: "Synthesizing research notes & drafting PRD specs" },
        { id: "gemini", name: "Gemini", size: "md", usage: "Daily", stages: ["discover", "define", "build"], tooltip: "Multimodal design audit & cross-referencing ideas" },
        { id: "notion", name: "Notion", size: "md", usage: "Daily", stages: ["discover", "define", "handoff"], tooltip: "Project wikis, structured sprint docs & roadmaps" }
      ]
    },
    build: {
      title: "Build",
      desc: "Crafting semantic, accessible code to bridge the gap between Figma and production.",
      color: "pink",
      tools: [
        { id: "html5", name: "HTML5", size: "md", usage: "Regular", stages: ["build"], tooltip: "Accessible semantic structure & SEO architecture" },
        { id: "css3", name: "CSS3", size: "md", usage: "Regular", stages: ["build"], tooltip: "Modern CSS Grid, Flexbox, Custom Properties & Animations" },
        { id: "javascript", name: "JavaScript", size: "lg", usage: "Regular", stages: ["prototype", "build"], tooltip: "DOM dynamics, state logic & lightweight interactions" },
        { id: "github", name: "GitHub", size: "md", usage: "Regular", stages: ["handoff", "build"], tooltip: "Version control, branching & design handoff tracking" },
        { id: "svg-motion", name: "SVG & motion", size: "md", usage: "Learning", stages: ["design", "build"], tooltip: "Crisp vector manipulation & micro-animation curves" }
      ]
    }
  };

  // Expose to window for user console inspectability
  window.TOOL_STACK_DATA = TOOL_STACK_DATA;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  // 1. CARDS STAGGERED ENTRANCE & TILT-TO-STRAIGHTEN
  const quadCards = document.querySelectorAll('.skills-quad-card');
  const cardTilts = ['-0.8deg', '0.7deg', '-0.6deg', '0.8deg'];

  if ('IntersectionObserver' in window && !prefersReduced) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cardObserver.unobserve(entry.target);
          const idx = Array.from(quadCards).indexOf(entry.target);
          entry.target.style.setProperty('--card-tilt', cardTilts[idx % cardTilts.length]);
          setTimeout(() => {
            entry.target.classList.add('is-in-view');
          }, idx * 100);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    quadCards.forEach(card => cardObserver.observe(card));
  } else {
    quadCards.forEach(c => c.classList.add('is-in-view'));
  }

  // 1B. RECRUITER CAPABILITY CARDS INTERACTIVE FILTER & ENTRANCE
  const capabilityCards = document.querySelectorAll('.sc-card');
  const skillTabButtons = document.querySelectorAll('.skills-tab-btn');

  if (skillTabButtons.length && capabilityCards.length) {
    skillTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-skill-filter');

        // Update active tab button state
        skillTabButtons.forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Filter / Highlight capability cards
        capabilityCards.forEach(card => {
          const cat = card.getAttribute('data-skill-cat');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            if (filter !== 'all') {
              card.style.transform = 'translateY(-4px) scale(1.01)';
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 2. WORKFLOW STAGE FILTER (CLICK & HOVER PREVIEW)
  const stageButtons = document.querySelectorAll('.stage-pill');
  const toolPills = document.querySelectorAll('.skill-tool-pill, .sc-pill');
  let currentActiveStage = null;

  function applyStageFilter(stage) {
    if (!stage) {
      stageButtons.forEach(b => b.classList.remove('is-active'));
      return;
    }
  }

  stageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const stage = btn.getAttribute('data-stage');
      if (currentActiveStage === stage) {
        currentActiveStage = null;
        stageButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
      } else {
        currentActiveStage = stage;
        stageButtons.forEach(b => {
          const isActive = b.getAttribute('data-stage') === stage;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      }
    });
  });

  // 3. TOOLTIP TAP HANDLER ON TOUCH & CLICK-OUTSIDE DISMISS
  toolPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const wasOpen = pill.classList.contains('is-tooltip-open');
      toolPills.forEach(p => p.classList.remove('is-tooltip-open'));
      if (!wasOpen) {
        pill.classList.add('is-tooltip-open');
        e.stopPropagation();
      }
    });
  });

  document.addEventListener('click', () => {
    toolPills.forEach(p => p.classList.remove('is-tooltip-open'));
  });

  // 4. SUBTLE MAGNETIC PULL TOWARDS CURSOR WITHIN 60px (Fine pointer only)
  let activeDragPill = null;

  if (isFinePointer && !prefersReduced) {
    window.addEventListener('mousemove', (e) => {
      if (activeDragPill) return;
      const mx = e.clientX;
      const my = e.clientY;

      toolPills.forEach(pill => {
        if (pill.classList.contains('is-stage-dimmed')) {
          pill.style.transform = '';
          return;
        }

        const rect = pill.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(mx - cx, my - cy);

        if (dist < 60) {
          const pull = (60 - dist) / 60;
          const dx = (mx - cx) * 0.22 * pull;
          const dy = (my - cy) * 0.22 * pull;
          pill.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(1.04)`;
        } else {
          if (!pill.classList.contains('is-stage-active')) {
            pill.style.transform = '';
          }
        }
      });
    }, { passive: true });
  }

  // 5. DRAGGABLE PILLS WITH SPRING-BACK (Fine pointer / mouse only)
  if (isFinePointer && !prefersReduced) {
    let startX = 0;
    let startY = 0;

    toolPills.forEach(pill => {
      pill.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        activeDragPill = pill;
        startX = e.clientX;
        startY = e.clientY;
        pill.style.transition = 'none';
        try { pill.setPointerCapture(e.pointerId); } catch (err) { }
      });

      pill.addEventListener('pointermove', (e) => {
        if (activeDragPill !== pill) return;
        const dx = Math.max(-50, Math.min(50, e.clientX - startX));
        const dy = Math.max(-40, Math.min(40, e.clientY - startY));
        pill.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
        pill.style.boxShadow = '6px 6px 0 var(--ink)';
      });

      function endDrag(e) {
        if (activeDragPill === pill) {
          activeDragPill = null;
          pill.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s';
          pill.style.transform = '';
          pill.style.boxShadow = '';
          try { pill.releasePointerCapture(e.pointerId); } catch (err) { }
        }
      }

      pill.addEventListener('pointerup', endDrag);
      pill.addEventListener('pointercancel', endDrag);
    });
  }
})();

// ============================================================
// REDESIGNED SECTION HANDLERS: PROJECTS, SKILLS, PROCESS
// ============================================================

// 1. PROJECTS FILTER & COUNTER
(function initRedesignedProjects() {
  const filterPills = document.querySelectorAll('.projects-filter-pill');
  const projectCards = document.querySelectorAll('.projects-card');
  const activeIdxEl = document.getElementById('cs-active-idx');

  if (!filterPills.length || !projectCards.length) return;

  filterPills.forEach((pill, idx) => {
    pill.addEventListener('keydown', (e) => {
      let targetPill = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetPill = filterPills[(idx + 1) % filterPills.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetPill = filterPills[(idx - 1 + filterPills.length) % filterPills.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetPill = filterPills[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        targetPill = filterPills[filterPills.length - 1];
      }

      if (targetPill) {
        targetPill.focus();
        targetPill.click();
      }
    });

    pill.addEventListener('click', () => {
      const selectedCategory = pill.getAttribute('data-filter');

      filterPills.forEach(p => {
        const isActive = p === pill;
        p.classList.toggle('is-active', isActive);
        p.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      let visibleCount = 0;
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const isMatch = selectedCategory === 'all' || cardCategory === selectedCategory;

        if (isMatch) {
          card.classList.remove('is-filtered-out');
          visibleCount++;
        } else {
          card.classList.add('is-filtered-out');
        }
      });

      if (activeIdxEl) {
        activeIdxEl.textContent = visibleCount < 10 ? `0${visibleCount}` : visibleCount;
      }
    });
  });
})();

// 2. SKILLS STICKER CLUSTER SCROLL REVEAL
(function initSkillsStickerWall() {
  const chips = document.querySelectorAll('.skills-chip');
  if (!chips.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          chips.forEach((chip, i) => {
            setTimeout(() => {
              chip.classList.add('is-revealed');
            }, i * 40);
          });
        }
      });
    }, { threshold: 0.15 });

    const clusterWrap = document.querySelector('.skills-cluster-wrap') || chips[0];
    observer.observe(clusterWrap);
  } else {
    chips.forEach(chip => chip.classList.add('is-revealed'));
  }
})();

