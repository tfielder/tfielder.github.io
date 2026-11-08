/* ============================================================
   Galaxy / Star Field Background
   ============================================================ */
(function () {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const BG          = '#060b18';
  const STAR_COUNT  = 300;

  // Nebula blobs — soft color clouds painted behind stars
  const NEBULAE = [
    { cx: 0.18, cy: 0.28, r: 0.38, color: [155,  93, 229], alpha: 0.055 }, // violet
    { cx: 0.78, cy: 0.62, r: 0.32, color: [0,   255, 135], alpha: 0.040 }, // emerald
    { cx: 0.52, cy: 0.12, r: 0.28, color: [75,  238, 208], alpha: 0.045 }, // teal
    { cx: 0.88, cy: 0.18, r: 0.22, color: [120,  60, 220], alpha: 0.050 }, // deep violet
    { cx: 0.35, cy: 0.80, r: 0.25, color: [190, 150, 255], alpha: 0.035 }, // lavender
  ];

  // Star color palette — mostly white/blue-white, rare color tints
  const STAR_COLORS = [
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255],
    [210, 225, 255],  // blue-white
    [210, 225, 255],
    [75,  238, 208],  // teal
    [155,  93, 229],  // violet
    [190, 150, 255],  // lavender
  ];

  let w, h, stars = [];

  function rgba(c, a) {
    return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
  }

  function Star() {
    this.x      = Math.random() * w;
    this.y      = Math.random() * h;
    this.r      = Math.random() < 0.82 ? 0.3 + Math.random() * 0.7   // small
                                        : 1.1 + Math.random() * 1.0;  // occasional larger
    this.color  = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    this.alpha  = 0.35 + Math.random() * 0.65;
    this.twinkle   = Math.random() < 0.30;
    this.phase     = Math.random() * Math.PI * 2;
    this.pulseHz   = 0.012 + Math.random() * 0.018;
    this.hasGlow   = this.r > 1.0;
    this.glowR     = this.r * 7;
  }

  Star.prototype.draw = function () {
    if (this.twinkle) this.phase += this.pulseHz;
    const pulse = this.twinkle ? Math.sin(this.phase) * 0.5 + 0.5 : 1;
    const a     = this.alpha * (this.twinkle ? 0.25 + pulse * 0.75 : 1);

    if (this.hasGlow) {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowR);
      g.addColorStop(0, rgba(this.color, a * 0.55));
      g.addColorStop(1, rgba(this.color, 0));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.glowR, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = rgba(this.color, a);
    ctx.fill();
  };

  function drawNebulae() {
    NEBULAE.forEach(n => {
      const cx = n.cx * w;
      const cy = n.cy * h;
      const r  = n.r  * Math.min(w, h);
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, rgba(n.color, n.alpha));
      g.addColorStop(1, rgba(n.color, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
  }

  function init() {
    stars = Array.from({ length: STAR_COUNT }, () => new Star());
  }

  function loop() {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);
    drawNebulae();
    stars.forEach(s => s.draw());
    requestAnimationFrame(loop);
  }

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();
  init();
  requestAnimationFrame(loop);
})();


/* ============================================================
   Glitch Scramble — Hero Name
   ============================================================ */
(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!?';
  const DURATION = 1400; // ms total
  const INTERVAL = 38;   // ms per frame
  const TOTAL_STEPS = Math.floor(DURATION / INTERVAL);

  function scramble(element, finalText) {
    let step = 0;
    element.textContent = finalText
      .split('')
      .map(c => c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)])
      .join('');

    const id = setInterval(() => {
      const progress = step / TOTAL_STEPS;
      const resolvedCount = Math.floor(progress * finalText.length);

      element.textContent = finalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < resolvedCount) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      step++;
      if (step >= TOTAL_STEPS) {
        clearInterval(id);
        element.textContent = finalText;
      }
    }, INTERVAL);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.getElementById('glitch-name');
    if (!nameEl) return;
    const finalText = nameEl.textContent.trim();
    // Brief pause so the page loads visually before the animation
    setTimeout(() => scramble(nameEl, finalText), 350);
  });
})();


/* ============================================================
   Smooth Scroll — handle anchor links inside scroll-container
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closeMenuBar();
      }
    });
  });
});


/* ============================================================
   Dot Navigation — active state via IntersectionObserver
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scroll-container');
  const sections   = document.querySelectorAll('.snap-section');
  const dotLinks   = document.querySelectorAll('.dot-link');

  const dotObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dotLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    root: scrollContainer,
    threshold: 0.5
  });

  sections.forEach(s => dotObserver.observe(s));
});


/* ============================================================
   Section Reveal — fade-up panels on scroll
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scroll-container');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    root: scrollContainer,
    threshold: 0.15
  });

  document.querySelectorAll('.section-reveal').forEach(el => {
    revealObserver.observe(el);
  });
});


/* ============================================================
   Mobile Nav Toggle
   ============================================================ */
function toggleMenuBar() {
  var topNav = document.getElementById("nav-bar");
  topNav.className = topNav.className === "topnav" ? "topnav responsive" : "topnav";
}

function closeMenuBar() {
  document.getElementById("nav-bar").className = "topnav";
}


/* ============================================================
   Easter Egg — for the curious developer
   ============================================================ */
console.log(
  '%c👋 Hey developer!',
  'color: #00FF87; font-size: 20px; font-weight: bold; font-family: monospace;'
);
console.log(
  '%cNice of you to look under the hood.',
  'color: #9B5DE5; font-size: 13px; font-family: monospace;'
);
console.log(
  '%c📬  timfielder.developer@gmail.com',
  'color: #4beed0; font-size: 13px; font-family: monospace;'
);
console.log(
  '%c🐙  github.com/tfielder',
  'color: #feda4a; font-size: 13px; font-family: monospace;'
);
console.log(
  '%cBuilt with vanilla JS, tsParticles, and too much coffee ☕',
  'color: rgba(232,244,248,0.5); font-size: 11px; font-family: monospace;'
);
