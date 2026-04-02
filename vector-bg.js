/**
 * Interactive Vector Background
 * - Particle mesh network
 * - Mouse interaction
 * - Performance optimized
 */

class VectorBackground {
  constructor() {
    this.canvas = document.getElementById('vector-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.maxParticles = 80;
    this.connectionDistance = 150;
    this.isPaused = false;
    this.isMobile = false;

    this.init();
    this.animate();
    this.addEventListeners();
    this.setupIntersectionObserver();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.isMobile = window.innerWidth < 768;

    // Adjust particle density based on screen size
    if (this.isMobile) {
      this.maxParticles = 30; // Further reduced for performance
      this.connectionDistance = 80;
    } else {
      this.maxParticles = 80;
      this.connectionDistance = 150;
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height));
    }
  }

  addEventListeners() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.resize();
        this.createParticles();
      }, 250);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPaused) return;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isPaused = !entry.isIntersecting;
      });
    }, { threshold: 0.1 });

    observer.observe(this.canvas);
  }

  drawLines() {
    // Skip line connections for mobile to save performance
    if (this.isMobile) return;

    const particlesCount = this.particles.length;
    for (let i = 0; i < particlesCount; i++) {
      const p1 = this.particles[i];

      for (let j = i + 1; j < particlesCount; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;
        const minDistSq = this.connectionDistance * this.connectionDistance;

        if (distSq < minDistSq) {
          const distance = Math.sqrt(distSq);
          const opacity = 1 - (distance / this.connectionDistance);
          this.ctx.strokeStyle = `rgba(0, 255, 163, ${opacity * 0.15})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }

      // Mouse connection - only for desktop
      if (this.mouse.x !== null) {
        const dx = p1.x - this.mouse.x;
        const dy = p1.y - this.mouse.y;
        const distSq = dx * dx + dy * dy;
        const mouseRadiusSq = this.mouse.radius * this.mouse.radius;

        if (distSq < mouseRadiusSq) {
          const distance = Math.sqrt(distSq);
          const opacity = 1 - (distance / this.mouse.radius);
          this.ctx.strokeStyle = `rgba(0, 255, 163, ${opacity * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    if (!this.isPaused) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const width = this.canvas.width;
      const height = this.canvas.height;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.update(width, height);
        p.draw(this.ctx);
      }

      this.drawLines();
    }

    requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
  }

  update(w, h) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(0, 255, 163, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new VectorBackground();

  // Parallax effect for blobs
  const blobWrappers = document.querySelectorAll('.blob-wrapper');
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    blobWrappers.forEach(wrapper => {
      const speed = parseFloat(getComputedStyle(wrapper).getPropertyValue('--speed')) || 40;
      const x = (centerX - clientX) / speed;
      const y = (centerY - clientY) / speed;
      wrapper.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
});