document.addEventListener("DOMContentLoaded", () => {
  // ———————————————————————————————————————
  // DOM references
  // ———————————————————————————————————————
  const canvas    = document.getElementById("emojiCanvas");
  if (!canvas) return;
  const ctx       = canvas.getContext("2d");
  const toggleChk = document.getElementById("toggleEmojiFx");
  if (!toggleChk) return;

  // ———————————————————————————————————————
  // Read saved state (default = true)
  // ———————————————————————————————————————
  let emojiFxEnabled = localStorage.getItem("emojiFxEnabled");
  if (emojiFxEnabled === null) {
    emojiFxEnabled = true;
  } else {
    emojiFxEnabled = emojiFxEnabled === "true";
  }

  // ———————————————————————————————————————
  // Initialize UI + canvas visibility
  // ———————————————————————————————————————
  toggleChk.checked    = emojiFxEnabled;
  canvas.style.display = emojiFxEnabled ? "block" : "none";

  // ———————————————————————————————————————
  // Wire up toggle
  // ———————————————————————————————————————
  toggleChk.addEventListener("change", () => {
    emojiFxEnabled = toggleChk.checked;
    localStorage.setItem("emojiFxEnabled", emojiFxEnabled);
    canvas.style.display = emojiFxEnabled ? "block" : "none";
  });

  // ———————————————————————————————————————
  // Canvas resize helper
  // ———————————————————————————————————————
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  setTimeout(resizeCanvas, 100);

  // ———————————————————————————————————————
  // Particle system state
  // ———————————————————————————————————————
  const emojis     = ["💻","📱","⌨️","🤖","🌐","🖱️"];
  let particles    = [];
  let mainEmojis   = [];
  let queue        = shuffle([...emojis]);

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  function nextEmoji() {
    if (queue.length === 0) queue = shuffle([...emojis]);
    return queue.pop();
  }

  // ———————————————————————————————————————
  // EmojiParticle class
  // ———————————————————————————————————————
  class EmojiParticle {
    constructor({ x, y, emoji, vx=0, vy=0, size=32, life=100, rot=0, rotSpeed=0, fade=true }) {
      Object.assign(this, { x, y, emoji, vx, vy, size, life, fade });
      this.alpha      = 1;
      this.rotation   = rot;
      this.rotationSpeed = rotSpeed;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.life--;
      if (this.fade) this.alpha = this.life / 100;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      ctx.font        = `${this.size}px serif`;
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  // ———————————————————————————————————————
  // Launch a main emoji, then burst
  // ———————————————————————————————————————
  function launch() {
    if (!emojiFxEnabled) return;
    if (mainEmojis.filter(m => m.life > 0).length >= 5) return;

    const zone    = Math.floor(Math.random() * 3);
    const zoneW   = canvas.width / 3;
    const sizeM   = 48;
    const margin  = sizeM * 2;         // ← 2× size margin
    // compute x inside zone…
    let x = Math.random() * (zoneW - sizeM * 2)
          + sizeM
          + zone * zoneW;
    // clamp into [margin, canvas.width - margin]
    x = Math.min(Math.max(x, margin), canvas.width - margin);

    const y     = canvas.height;
    const peak  = Math.random() * (canvas.height * 0.2) 
                + canvas.height * 0.1;
    const e     = nextEmoji();

    const main = new EmojiParticle({ x, y, emoji: e, vy: -2.5, size: sizeM, life: 1000 });
    mainEmojis.push(main);
    particles.push(main);

    const id = setInterval(() => {
      if (main.y <= peak) {
        clearInterval(id);
        mainEmojis = mainEmojis.filter(m => m !== main);
        particles  = particles.filter(p => p !== main);
        burst(main.x, main.y, e);
      } else {
        main.update();
        // add a little trail occasionally
        if (Math.random() < 0.7) {
          particles.push(new EmojiParticle({
            x: main.x,
            y: main.y + main.size * 0.4,
            emoji: main.emoji,
            size: 14,
            life: 20,
            rot: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.2
          }));
        }
      }
    }, 16);
  }

  // ———————————————————————————————————————
  // Burst after main reaches peak
  // ———————————————————————————————————————
  function burst(x, y, emojiChar) {
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      particles.push(new EmojiParticle({
        x,
        y,
        emoji: emojiChar,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 20,
        life: 100,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2
      }));
    }
  }

  // ———————————————————————————————————————
  // Animation loop
  // ———————————————————————————————————————
  function step(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });

    if (!step.last || ts - step.last >= 8000) {
      launch();
      step.last = ts;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
});
