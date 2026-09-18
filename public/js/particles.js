// Atmospheric Canvas Effects: Starry Sky, Rose Petals, Fireflies, Fireworks, Confetti

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.stars = [];
    this.shootingStars = [];
    this.petals = [];
    this.fireflies = [];
    this.confetti = [];
    this.fireworks = [];
    this.isRunning = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initStars();
    this.initFireflies();
    this.initPetals(25);
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initStars() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 3500);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.75),
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  initFireflies() {
    this.fireflies = [];
    for (let i = 0; i < 20; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: this.height * 0.4 + Math.random() * (this.height * 0.6),
        radius: Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI
      });
    }
  }

  initPetals(count = 20) {
    this.petals = [];
    for (let i = 0; i < count; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: Math.random() * 10 + 10,
      vx: Math.random() * 1.5 - 0.5,
      vy: Math.random() * 1.2 + 1.0,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.02,
      color: Math.random() > 0.4 ? '#ff5376' : '#ff758f',
      opacity: Math.random() * 0.4 + 0.6
    };
  }

  triggerShootingStar() {
    const startX = Math.random() * (this.width * 0.7);
    const startY = Math.random() * (this.height * 0.3);
    const length = Math.random() * 120 + 80;
    this.shootingStars.push({
      x: startX,
      y: startY,
      len: length,
      speed: Math.random() * 8 + 10,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
      alpha: 1
    });
  }

  triggerConfetti(originX = this.width / 2, originY = this.height / 2, count = 90) {
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166', '#06d6a0', '#118ab2', '#fff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.confetti.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 5 + 3),
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        alpha: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'heart'
      });
    }
  }

  triggerFireworks(x = this.width / 2, y = this.height * 0.3) {
    const colors = ['#ff758f', '#ffb703', '#fb8500', '#ffd166', '#a2d2ff', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 70;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1.5;
      this.fireworks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();

    // Occasional shooting star
    setInterval(() => {
      if (Math.random() > 0.4) {
        this.triggerShootingStar();
      }
    }, 4500);
  }

  animate() {
    if (!this.isRunning) return;
    requestAnimationFrame(() => this.animate());

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Stars
    this.stars.forEach(s => {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.95) s.twinkleDir = -1;
      if (s.alpha < 0.2) s.twinkleDir = 1;

      this.ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 2. Shooting stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.02;

      const tailX = ss.x - Math.cos(ss.angle) * ss.len;
      const tailY = ss.y - Math.sin(ss.angle) * ss.len;

      const grad = this.ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
      grad.addColorStop(1, `rgba(255, 180, 200, 0)`);

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(ss.x, ss.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();

      if (ss.alpha <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }

    // 3. Fireflies
    this.fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      f.pulse += 0.04;
      const alpha = f.alpha * (0.6 + 0.4 * Math.sin(f.pulse));

      if (f.x < 0 || f.x > this.width) f.vx *= -1;
      if (f.y < this.height * 0.3 || f.y > this.height) f.vy *= -1;

      const grad = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 3);
      grad.addColorStop(0, `rgba(255, 230, 150, ${alpha})`);
      grad.addColorStop(1, `rgba(255, 200, 100, 0)`);

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius * 3, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 4. Rose Petals
    this.petals.forEach((p, idx) => {
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 1.2;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;

      // Realistic curved petal
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.4, p.size * 0.9, p.size * 0.4, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.5, -p.size * 0.4, 0, 0);
      this.ctx.fill();
      this.ctx.restore();

      if (p.y > this.height + 30) {
        this.petals[idx] = this.createPetal(false);
      }
    });

    // 5. Confetti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.25; // Gravity
      c.vx *= 0.98;
      c.rotation += c.rotationSpeed;
      c.alpha -= 0.007;

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, c.alpha);
      this.ctx.fillStyle = c.color;

      if (c.shape === 'heart') {
        const s = c.size * 0.6;
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(0, 0, -s, 0, -s, s * 0.6);
        this.ctx.bezierCurveTo(-s, s * 1.2, 0, s * 1.5, 0, s * 1.8);
        this.ctx.bezierCurveTo(0, s * 1.5, s, s * 1.2, s, s * 0.6);
        this.ctx.bezierCurveTo(s, 0, 0, 0, 0, s * 0.3);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
      }
      this.ctx.restore();

      if (c.alpha <= 0 || c.y > this.height + 50) {
        this.confetti.splice(i, 1);
      }
    }

    // 6. Fireworks
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.vy += 0.05;
      fw.alpha -= fw.decay;

      this.ctx.fillStyle = fw.color;
      this.ctx.globalAlpha = Math.max(0, fw.alpha);
      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
      this.ctx.fill();

      if (fw.alpha <= 0) {
        this.fireworks.splice(i, 1);
      }
    }
  }
}

window.ParticleEngine = ParticleEngine;
