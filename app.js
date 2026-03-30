// ── 0. SMOOTH SCROLL (LENIS) ────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ── 1. FOOTER YEAR ──────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── 2. CUSTOM CURSOR ────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const dot     = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  let mx = -100, my = -100, ox = -100, oy = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });

  function trackOutline() {
    ox += (mx - ox) * 0.12;
    oy += (my - oy) * 0.12;
    outline.style.transform = `translate(${ox}px, ${oy}px)`;
    requestAnimationFrame(trackOutline);
  }
  requestAnimationFrame(trackOutline);

  document.querySelectorAll('a, button, .project-card, .cert-card, .about-card').forEach(el => {
    el.addEventListener('mouseenter', () => { outline.classList.add('cursor-hover'); dot.style.opacity = '0'; });
    el.addEventListener('mouseleave', () => { outline.classList.remove('cursor-hover'); dot.style.opacity = '1'; });
  });
}

// ── 3. SMOOTH ANCHOR SCROLL ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetId = a.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, {
      offset: 0,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  });
});

// ── 4. FLOATING NAV ACTIVE ──────────────────────
const sections = document.querySelectorAll('.section[id]');
const navItems = document.querySelectorAll('.fnav-item');

function updateNav() {
  let current = '';
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top <= window.innerHeight * 0.45) {
      current = sec.id;
    }
  });
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === current);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── 5. MAGNETIC NAV ─────────────────────────────
navItems.forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── 6. SCROLL REVEAL ────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-el').forEach(el => revealObserver.observe(el));

// ── 7. COUNT-UP STATS ───────────────────────────
function countUp(el, target, duration = 1600) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      countUp(entry.target, target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ── 8. 3D TILT ON CARDS ─────────────────────────
document.querySelectorAll('.project-card, .about-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = e.clientX - r.left;
    const y  = e.clientY - r.top;
    const rx = ((y - r.height / 2) / (r.height / 2)) * -6;
    const ry = ((x - r.width  / 2) / (r.width  / 2)) * 6;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s, box-shadow 0.3s';
  });
});

// ── 9. CONTACT FORM ─────────────────────────────
const form      = document.getElementById('contact-form');
const btnText   = document.getElementById('btn-text');
const btnLoad   = document.getElementById('btn-loading');
const success   = document.getElementById('form-success');

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{ transform:translateX(0) }
    20%{ transform:translateX(-8px) }
    40%{ transform:translateX(8px) }
    60%{ transform:translateX(-5px) }
    80%{ transform:translateX(5px) }
  }
`;
document.head.appendChild(shakeStyle);

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const msg   = document.getElementById('cf-message').value.trim();

    if (!name || !email || !msg) {
      form.style.animation = 'shake .4s ease';
      form.addEventListener('animationend', () => { form.style.animation = ''; }, { once: true });
      return;
    }

    btnText.classList.add('hidden');
    btnLoad.classList.remove('hidden');

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      btnText.classList.remove('hidden');
      btnLoad.classList.add('hidden');
      if (response.ok) {
        success.classList.remove('hidden');
        form.reset();
        setTimeout(() => success.classList.add('hidden'), 5000);
      } else {
        alert("Oops! There was a problem submitting your form. Please try again or contact me directly.");
      }
    }).catch(error => {
      btnText.classList.remove('hidden');
      btnLoad.classList.add('hidden');
      alert("Something went wrong. Please check your connection and try again.");
    });
  });
}

// ── 10. PROFILE CARD TILT ───────────────────────
const profileCard = document.getElementById('profile-card');
if (profileCard) {
  profileCard.addEventListener('mousemove', e => {
    const r  = profileCard.getBoundingClientRect();
    const x  = e.clientX - r.left;
    const y  = e.clientY - r.top;
    const rx = ((y - r.height / 2) / (r.height / 2)) * -5;
    const ry = ((x - r.width  / 2) / (r.width  / 2)) * 5;
    profileCard.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    profileCard.style.transition = 'none';
  });
  profileCard.addEventListener('mouseleave', () => {
    profileCard.style.transform = '';
    profileCard.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });
}

// ── 11. ROLE CYCLER ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const words = document.querySelectorAll('.rw');
  if (!words.length) return;
  let current = 0;

  function cycle() {
    const prev = current;
    current = (current + 1) % words.length;

    // Exit current
    words[prev].classList.remove('active');
    words[prev].classList.add('exit');

    // Enter next
    words[current].classList.remove('exit');
    words[current].classList.add('active');

    // Clean up previous after animation
    setTimeout(() => {
      words[prev].classList.remove('exit');
    }, 1000);
  }

  setInterval(cycle, 3000);
});

// ── 12. STAT CARD HOVER PULSE ───────────────────
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const num = card.querySelector('.stat-num');
    if (!num) return;
    num.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
    num.style.transform = 'scale(1.15)';
  });
  card.addEventListener('mouseleave', () => {
    const num = card.querySelector('.stat-num');
    if (!num) return;
    num.style.transform = 'scale(1)';
  });
});

// ── 13. REAL-TIME CLOCK ─────────────────────────
function updateClock() {
  const clockEl = document.getElementById('live-time');
  if (!clockEl) return;
  
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  
  clockEl.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

