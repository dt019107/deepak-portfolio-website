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
    
    this.init();
    this.animate();
    this.addEventListeners();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Adjust particle density based on screen size
    if (window.innerWidth < 768) {
      this.maxParticles = 40;
      this.connectionDistance = 100;
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
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawLines() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = 1 - (distance / this.connectionDistance);
          this.ctx.strokeStyle = `rgba(0, 255, 163, ${opacity * 0.2})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }

      // Mouse connection
      if (this.mouse.x !== null) {
        const dx = this.particles[i].x - this.mouse.x;
        const dy = this.particles[i].y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const opacity = 1 - (distance / this.mouse.radius);
          this.ctx.strokeStyle = `rgba(0, 255, 163, ${opacity * 0.4})`;
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.update(this.canvas.width, this.canvas.height);
      particle.draw(this.ctx);
    });

    this.drawLines();
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
