/* =============================================
   DEEPAK TIWARI – PORTFOLIO SCRIPTS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── 0. SMOOTH SCROLL (LENIS) ────────────────────
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

  // ── 1. FOOTER YEAR ──────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Clean up any legacy dark mode settings
  localStorage.removeItem('dt-theme');
  document.documentElement.removeAttribute('data-theme');

  // ── 4. SCROLL PROGRESS BAR ─────────────────────
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    if (progressBar) progressBar.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ── 5. BACK TO TOP & HEADER SCROLL ─────────────
  const backToTop = document.getElementById('back-to-top');
  const topHeader = document.getElementById('top-header');
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    if (topHeader) topHeader.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.2 }));
  }

  // ── 6. RIPPLE EFFECT ───────────────────────────
  function addRipple(el) {
    el.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }
  document.querySelectorAll('.btn-primary, .btn-ghost, .btn-contact, .btn-cv').forEach(addRipple);

  // ── 7. PROFILE CARD GLOW ───────────────────────
  const profileCard = document.getElementById('profile-card');
  const cardGlow = document.getElementById('card-glow');
  if (profileCard && cardGlow) {
    profileCard.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      cardGlow.style.left = (e.clientX - rect.left) + 'px';
      cardGlow.style.top = (e.clientY - rect.top) + 'px';
    });
  }

  // ── 8. CUSTOM CURSOR ───────────────────────────
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouch && window.matchMedia('(pointer: fine)').matches) {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    let mx = -100, my = -100, ox = -100, oy = -100;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (dot) dot.style.transform = `translate(${mx}px,${my}px)`;
    });

    function trackOutline() {
      ox += (mx - ox) * 0.12;
      oy += (my - oy) * 0.12;
      if (outline) outline.style.transform = `translate(${ox}px,${oy}px)`;
      requestAnimationFrame(trackOutline);
    }
    requestAnimationFrame(trackOutline);

    document.querySelectorAll('a, button, .project-card, .cert-card, .about-card').forEach(el => {
      el.addEventListener('mouseenter', () => { if (outline) outline.classList.add('cursor-hover'); if (dot) dot.style.opacity = '0'; });
      el.addEventListener('mouseleave', () => { if (outline) outline.classList.remove('cursor-hover'); if (dot) dot.style.opacity = '1'; });
    });
  }

  // ── 9. SMOOTH ANCHOR SCROLL ────────────────────
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

  // ── 10. FLOATING NAV ACTIVE ────────────────────
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

  // ── 11. NAV HOVER ─────────────────────────────
  // Clean neo-brutalist spring hover handled via CSS classes


  // ── 12. SCROLL REVEAL ──────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-el').forEach(el => revealObserver.observe(el));

  // ── 13. COUNT-UP STATS ─────────────────────────
  function countUp(el, target, dur = 1600) {
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
  }, { threshold: 0.8 });
  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

  // ── 14. 3D TILT ON CARDS ───────────────────────
  if (!isTouch) {
    document.querySelectorAll('.about-card, .cert-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6;
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        card.style.transition = 'none';
      });
      card.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          card.style.transition = 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1), border-color 0.3s, box-shadow 0.3s';
          card.style.transform = '';
        });
      });
    });

    // Profile card tilt
    if (profileCard) {
      profileCard.addEventListener('mousemove', e => {
        const r = profileCard.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -5;
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 5;
        profileCard.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        profileCard.style.transition = 'none';
      });
      profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = '';
        profileCard.style.transition = 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1)';
      });
    }
  }

  // ── 15. CONTACT FORM ───────────────────────────
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
  shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
  document.head.appendChild(shakeStyle);

  function clearFieldError(input, errorEl) {
    if (input) {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    }
    if (errorEl) {
      errorEl.classList.add('hidden');
    }
  }

  if (nameInput) nameInput.addEventListener('input', () => clearFieldError(nameInput, nameError));
  if (emailInput) emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
  if (msgInput) msgInput.addEventListener('input', () => clearFieldError(msgInput, msgError));

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      let hasError = false;
      let firstInvalid = null;

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) {
          nameInput.classList.add('is-invalid');
          nameInput.setAttribute('aria-invalid', 'true');
        }
        if (nameError) nameError.classList.remove('hidden');
        hasError = true;
        firstInvalid = firstInvalid || nameInput;
      } else {
        clearFieldError(nameInput, nameError);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        if (emailInput) {
          emailInput.classList.add('is-invalid');
          emailInput.setAttribute('aria-invalid', 'true');
        }
        if (emailError) emailError.classList.remove('hidden');
        hasError = true;
        firstInvalid = firstInvalid || emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      // Validate Message
      if (!msgInput || !msgInput.value.trim()) {
        if (msgInput) {
          msgInput.classList.add('is-invalid');
          msgInput.setAttribute('aria-invalid', 'true');
        }
        if (msgError) msgError.classList.remove('hidden');
        hasError = true;
        firstInvalid = firstInvalid || msgInput;
      } else {
        clearFieldError(msgInput, msgError);
      }

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
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(() => {
          if (btnText) btnText.classList.remove('hidden');
          if (btnLoad) btnLoad.classList.add('hidden');
          if (formError) {
            formError.classList.remove('hidden');
          }
        });
    });
  }

  // ── 16. ROLE CYCLER ────────────────────────────
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

  // ── 17. STAT CARD HOVER PULSE ──────────────────
  document.querySelectorAll('.bento-card.stat-bento').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const num = card.querySelector('.stat-num');
      if (num) { num.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'; num.style.transform = 'scale(1.15)'; }
    });
    card.addEventListener('mouseleave', () => {
      const num = card.querySelector('.stat-num');
      if (num) num.style.transform = 'scale(1)';
    });
  });

  // ── 18. PARALLAX SCROLLING ENGINE ─────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && !isTouch) {
    const parallaxEls = [];

    function initParallax() {
      parallaxEls.length = 0;
      document.querySelectorAll('[data-parallax]').forEach(el => {
        parallaxEls.push({ el, speed: parseFloat(el.getAttribute('data-parallax')) || 0.1 });
      });
    }
    initParallax();

    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(initParallax, 250); }, { passive: true });

    let parallaxTicking = false;
    function applyParallax() {
      const viewH = window.innerHeight;
      parallaxEls.forEach(({ el, speed }) => {
        if (el.classList.contains('reveal-el') && !el.classList.contains('revealed')) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -400 || rect.top > viewH + 400) return;
        const offset = -((rect.top + rect.height / 2 - viewH / 2) * speed);
        el.style.setProperty('--py', `${offset}px`);
      });
      parallaxTicking = false;
    }
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) { requestAnimationFrame(applyParallax); parallaxTicking = true; }
    }, { passive: true });
    requestAnimationFrame(applyParallax);
  }

  // ── 19. BENTO CARD GLOW EFFECT ─────────────────
  if (!isTouch) {
    document.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
      });
    });
  }

}); // end DOMContentLoaded

/* ── MOBILE NAV DRAWER ── */
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
    // Force reflow for transition
    mobileOverlay.getBoundingClientRect();
    mobileOverlay.classList.add('open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Stagger links entrance
    mobileNavItems.forEach((item, index) => {
      setTimeout(() => {
        if (mobileOverlay.classList.contains('open')) {
          item.classList.add('stagger-in');
        }
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
    // Wait for animation to finish before hiding
    setTimeout(() => {
      if (!mobileOverlay.classList.contains('open')) {
        mobileOverlay.style.display = 'none';
      }
    }, 400);
  }

  hamburgerBtn.addEventListener('click', () => {
    if (mobileOverlay.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileNav);
  }

  // Close on backdrop click
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) closeMobileNav();
  });

  // Close on nav link click and scroll to section
  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      closeMobileNav();
      mobileNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Close on mobile CTA button clicks (e.g. Say hi link)
  mobileCtas.forEach(cta => {
    cta.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Keyboard: close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Sync mobile nav active state with scroll position
  const sections = document.querySelectorAll('.section[id]');
  function updateMobileNavActive() {
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.45) current = sec.id;
    });
    mobileNavItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === current);
    });
  }
  window.addEventListener('scroll', updateMobileNavActive, { passive: true });
  updateMobileNavActive();

  // Hide overlay on initial display
  mobileOverlay.style.display = 'none';
})();