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

  // ── 2. THEME TOGGLE ─────────────────────────────
  const HTML_EL = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  const savedTheme = localStorage.getItem('dt-theme') || 'dark';
  if (savedTheme === 'light') HTML_EL.setAttribute('data-theme', 'light');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = HTML_EL.getAttribute('data-theme') === 'light';
      if (isLight) {
        HTML_EL.removeAttribute('data-theme');
        localStorage.setItem('dt-theme', 'dark');
      } else {
        HTML_EL.setAttribute('data-theme', 'light');
        localStorage.setItem('dt-theme', 'light');
      }
    });
  }

  // ── 3. REAL-TIME CLOCK ──────────────────────────
  const clockEl = document.getElementById('live-time');
  const ampmEl = document.getElementById('live-ampm');
  const dateEl = document.getElementById('live-date');

  function updateClock() {
    const now = new Date();
    let hrs = now.getHours();
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    if (clockEl) clockEl.textContent = `${String(hrs).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    if (ampmEl) ampmEl.textContent = ampm;
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── 4. SCROLL PROGRESS BAR ─────────────────────
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    if (progressBar) progressBar.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ── 5. BACK TO TOP ─────────────────────────────
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
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

  // ── 11. MAGNETIC NAV ───────────────────────────
  navItems.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.5}px,${(e.clientY - r.top - r.height / 2) * 0.5}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

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
    document.querySelectorAll('.project-card, .about-card, .cert-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6;
        const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        card.style.transition = 'none';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1), border-color 0.3s, box-shadow 0.3s';
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

  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
  document.head.appendChild(shakeStyle);

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!document.getElementById('cf-name').value.trim() ||
        !document.getElementById('cf-email').value.trim() ||
        !document.getElementById('cf-message').value.trim()) {
        form.style.animation = 'shake .4s ease';
        form.addEventListener('animationend', () => { form.style.animation = ''; }, { once: true });
        return;
      }
      if (btnText) btnText.classList.add('hidden');
      if (btnLoad) btnLoad.classList.remove('hidden');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(res => {
          if (btnText) btnText.classList.remove('hidden');
          if (btnLoad) btnLoad.classList.add('hidden');
          if (res.ok) { if (success) { success.classList.remove('hidden'); setTimeout(() => success.classList.add('hidden'), 5000); } form.reset(); }
          else throw new Error('fail');
        })
        .catch(() => {
          if (btnText) btnText.classList.remove('hidden');
          if (btnLoad) btnLoad.classList.add('hidden');
          alert('Oops! Something went wrong. Please try again.');
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
  document.querySelectorAll('.stat-card').forEach(card => {
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

  // ── 19. PROJECT PREVIEWS ON HOVER ─────────────
  const projectCards = document.querySelectorAll('.project-card');
  const projectCursorPreview = document.getElementById('project-cursor-preview');
  const pcImage = document.getElementById('pc-image');
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');

  if (!isTouch && projectCursorPreview && pcImage) {
    let px = 0, py = 0, tpx = 0, tpy = 0;

    projectCards.forEach(card => {
      const video = card.querySelector('.project-video');
      const img = card.querySelector('.project-img img');
      const title = card.querySelector('.project-info h3');

      // Video Hover Logic
      card.addEventListener('mouseenter', () => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => { });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (video) {
          video.pause();
        }
      });

      // Floating Image Logic (on Card or Title hover)
      const showPreview = () => {
        if (img) {
          pcImage.src = img.src;
          projectCursorPreview.classList.add('active');
          if (outline) outline.classList.add('hide');
        }
      };

      const hidePreview = () => {
        projectCursorPreview.classList.remove('active');
        if (outline) outline.classList.remove('hide');
      };

      // Trigger on whole card for better experience, or just title as requested
      // The user said: "As the user hovers over a project title, a 'floating' image... follow the cursor"
      // But usually it feels better on the whole card. I'll stick to 'project-card' for general hover, 
      // and maybe emphasize 'title' if they really want just that. 
      // I'll apply it to the whole card as it's more standard for this effect.
      card.addEventListener('mouseenter', showPreview);
      card.addEventListener('mouseleave', hidePreview);
    });

    // Bento Card Glow Effect
    document.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
      });
    });

    // Cursor Follow Logic for Preview
    window.addEventListener('mousemove', e => {
      tpx = e.clientX;
      tpy = e.clientY;
    });

    function updatePreviewPos() {
      // Smooth follow with lerp
      px += (tpx - px) * 0.15;
      py += (tpy - py) * 0.15;

      // Offset preview slightly from cursor
      projectCursorPreview.style.left = `${px + 20}px`;
      projectCursorPreview.style.top = `${py + 20}px`;

      requestAnimationFrame(updatePreviewPos);
    }
    requestAnimationFrame(updatePreviewPos);
  }

}); // end DOMContentLoaded
