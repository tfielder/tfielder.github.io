/* ============================================================
   Particle Background — Flowing Nebula
   ============================================================ */
tsParticles.load("tsparticles", {
  background: {
    color: { value: "#060b18" }
  },
  fpsLimit: 60,
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: { enable: true, mode: "bubble" }
    },
    modes: {
      bubble: {
        distance: 180,
        size: 5,
        duration: 2,
        opacity: 0.8
      }
    }
  },
  particles: {
    color: {
      value: ["#00FF87", "#9B5DE5", "#4beed0", "#feda4a", "#ffffff"]
    },
    links: { enable: false },
    move: {
      direction: "none",
      enable: true,
      outModes: { default: "out" },
      random: true,
      speed: { min: 0.1, max: 0.55 },
      straight: false,
      warp: false
    },
    number: {
      density: { enable: true, area: 850 },
      value: 110
    },
    opacity: {
      value: { min: 0.04, max: 0.55 },
      animation: {
        enable: true,
        minimumValue: 0.04,
        speed: 0.4,
        sync: false
      }
    },
    shape: { type: "circle" },
    size: {
      value: { min: 1, max: 3.5 },
      animation: {
        enable: true,
        minimumValue: 0.5,
        speed: 0.8,
        sync: false
      }
    },
    wobble: {
      distance: 8,
      enable: true,
      speed: { angle: 8, move: 8 }
    }
  },
  detectRetina: true
});


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
