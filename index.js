/* ============================================================
   Aurora Canvas Background — Perlin Noise Flow Field
   ============================================================ */
(function () {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Low-resolution offscreen canvas — scales up smoothly for perf
  const off  = document.createElement('canvas');
  const octx = off.getContext('2d');

  const RES   = 6;       // px per cell (lower = sharper, slower)
  const SPEED = 0.00022; // time increment per frame

  let w, h, cols, rows, imgData, px;
  let t = 0;

  /* --- Perlin noise ---------------------------------------- */
  const perm  = new Uint8Array(512);
  const GRADS = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];

  (function seedNoise() {
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  })();

  function fade(t)       { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function dot(g, x, y)  { return g[0] * x + g[1] * y; }

  function noise(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const A = perm[X] + Y, B = perm[X + 1] + Y;
    return lerp(v,
      lerp(u, dot(GRADS[perm[A]     & 7], x,     y),
               dot(GRADS[perm[B]     & 7], x - 1, y)),
      lerp(u, dot(GRADS[perm[A + 1] & 7], x,     y - 1),
               dot(GRADS[perm[B + 1] & 7], x - 1, y - 1))
    ); // -1 to 1
  }

  // 2-octave fBm for organic layering
  function fbm(x, y) {
    return noise(x, y) * 0.6 + noise(x * 2.1, y * 2.1) * 0.4;
  }

  /* --- Aurora color palette -------------------------------- */
  const PAL = [
    [  6,  11,  24],  // dark navy bg
    [  6,  11,  24],  // still dark
    [  0,  70,  40],  // deep dim green
    [  0, 200, 100],  // mid emerald
    [  0, 255, 135],  // bright emerald  #00FF87
    [ 75, 238, 208],  // teal            #4beed0
    [155,  93, 229],  // violet          #9B5DE5
    [ 55,  18,  95],  // deep violet
    [  6,  11,  24],  // back to bg
  ];

  function colorAt(v) {
    v = Math.max(0, Math.min(0.9999, v));
    const f = v * (PAL.length - 1);
    const i = Math.floor(f);
    const m = f - i;
    const a = PAL[i], b = PAL[i + 1];
    return [
      (a[0] + (b[0] - a[0]) * m) | 0,
      (a[1] + (b[1] - a[1]) * m) | 0,
      (a[2] + (b[2] - a[2]) * m) | 0,
    ];
  }

  /* --- Resize --------------------------------------------- */
  function resize() {
    w    = canvas.width  = window.innerWidth;
    h    = canvas.height = window.innerHeight;
    cols = Math.ceil(w / RES) + 1;
    rows = Math.ceil(h / RES) + 1;
    off.width  = cols;
    off.height = rows;
    imgData = octx.createImageData(cols, rows);
    px      = imgData.data;
  }

  /* --- Draw loop ------------------------------------------ */
  function draw() {
    t += SPEED;

    for (let y = 0; y < rows; y++) {
      const ny = y / rows;

      // Vertical mask: aurora band peaks around 35% from top, fades toward edges
      const vMask = Math.pow(Math.max(0, Math.sin(ny * Math.PI * 1.1)), 1.5);

      for (let x = 0; x < cols; x++) {
        const nx = x / cols;

        // Primary intensity — slow horizontal drift over time
        const n1 = fbm(nx * 2.5 + t, ny * 1.8);

        // Color variation — different drift axis for independent color shift
        const n2 = fbm(nx * 2.0 - t * 0.55 + 40, ny * 2.5 + 20);

        // Intensity: 0–1, shaped by vertical mask
        const intensity = ((n1 + 1) / 2) * vMask;

        // Color blend: mix of intensity and independent color noise
        const colorV = intensity * 0.55 + ((n2 + 1) / 2) * 0.45;

        const [r, g, b] = intensity > 0.1 ? colorAt(colorV) : PAL[0];

        const i = (y * cols + x) * 4;
        px[i]     = r;
        px[i + 1] = g;
        px[i + 2] = b;
        px[i + 3] = 255;
      }
    }

    octx.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(off, 0, 0, w, h);

    requestAnimationFrame(draw);
  }

  // Animation disabled — solid background only
  // window.addEventListener('resize', resize);
  // resize();
  // requestAnimationFrame(draw);

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = '#060b18';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
