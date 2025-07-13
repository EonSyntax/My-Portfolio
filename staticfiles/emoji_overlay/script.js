const canvas = document.getElementById("emojiCanvas");
const ctx = canvas.getContext("2d");

// Load toggle state from localStorage (default ON)
let emojiFxEnabled = localStorage.getItem("emojiFxEnabled") !== "false";

// Apply canvas visibility
canvas.style.display = emojiFxEnabled ? "block" : "none";

// Handle toggle button click
const toggleBtn = document.getElementById("toggleEmojiFx");
if (toggleBtn) {
  toggleBtn.textContent = emojiFxEnabled ? "🎉 FX: ON" : "🎉 FX: OFF";
  toggleBtn.addEventListener("click", () => {
    emojiFxEnabled = !emojiFxEnabled;
    localStorage.setItem("emojiFxEnabled", emojiFxEnabled);
    canvas.style.display = emojiFxEnabled ? "block" : "none";
    toggleBtn.textContent = emojiFxEnabled ? "🎉 FX: ON" : "🎉 FX: OFF";
  });
}

// Dynamic canvas resize
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", () => {
  setTimeout(resizeCanvas, 100);
});

const emojis = ["💻", "📱", "⌨️", "🤖", "🌐", "🖱️"];
let particles = [];
let mainEmojis = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
let emojiQueue = shuffle([...emojis]);
function getNextEmoji() {
  if (emojiQueue.length === 0) emojiQueue = shuffle([...emojis]);
  return emojiQueue.pop();
}

class EmojiParticle {
  constructor({ x, y, emoji, vx = 0, vy = 0, size = 32, life = 100, rot = 0, rotSpeed = 0, isMain = false }) {
    this.x = x;
    this.y = y;
    this.emoji = emoji;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.life = life;
    this.alpha = 1;
    this.rotation = rot;
    this.rotationSpeed = rotSpeed;
    this.isMain = isMain;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.life--;
    this.alpha = this.life / 100;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;
    ctx.font = `${this.size}px serif`;
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

function launchEmoji() {
  if (!emojiFxEnabled) return;

  const activeLaunchers = mainEmojis.filter(e => e.life > 0);
  if (activeLaunchers.length >= 5) return;

  const emojiSize = 48;
  const x = Math.random() * (canvas.width - emojiSize * 2) + emojiSize;
  const y = canvas.height;

  // Allow peak height to randomly reach 80-90% of screen height
  const minHeight = canvas.height * 0.1; // near top
  const maxHeight = canvas.height * 0.2; // not always top
  const peak = Math.random() * (maxHeight - minHeight) + minHeight;

  const emoji = getNextEmoji();

  const mainEmoji = new EmojiParticle({
    x,
    y,
    emoji,
    vx: 0,
    vy: -2.5,
    size: emojiSize,
    life: 1000,
    isMain: true
  });

  mainEmojis.push(mainEmoji);
  particles.push(mainEmoji);

  const moveInterval = setInterval(() => {
    if (mainEmoji.y <= peak) {
      particles = particles.filter(p => p !== mainEmoji);
      mainEmojis = mainEmojis.filter(p => p !== mainEmoji);
      clearInterval(moveInterval);
      burstEmoji(mainEmoji.x, mainEmoji.y, emoji);
    } else {
      mainEmoji.update();
    }
  }, 16);
}

function burstEmoji(x, y, emoji) {
  for (let i = 0; i < 25; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 2.5 + 0.5;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const rotation = Math.random() * Math.PI;
    const rotSpeed = (Math.random() - 0.5) * 0.2;

    const p = new EmojiParticle({
      x,
      y,
      emoji,
      vx,
      vy,
      size: 20,
      life: 100,
      rot: rotation,
      rotSpeed
    });
    particles.push(p);
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  for (let p of particles) {
    p.update();
    p.draw();
  }

  // ⏱️ Manual launch timing (every 8 seconds, but only when visible)
  const now = performance.now();
  if (!animate.lastLaunchTime || now - animate.lastLaunchTime >= 8000) {
    launchEmoji();
    animate.lastLaunchTime = now;
  }

  requestAnimationFrame(animate);
}

animate();
