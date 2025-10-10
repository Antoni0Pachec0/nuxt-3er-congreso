// public/particles-init.js
(function () {
  // ---- Config de fallback (idéntica a tu JSON) ----
  const FALLBACK_CONFIG = {
  "particles": {
    "number": {
      "value": 160,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#b3d7ff"
    },
    "shape": {
      "type": "edge",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 1,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 10,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 4,
        "size_min": 0.3,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 600
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "bubble"
      },
      "onclick": {
        "enable": false,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 250,
        "size": 0,
        "duration": 2,
        "opacity": 0,
        "speed": 3
      },
      "repulse": {
        "distance": 400,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
};

  // Espera a que exista el div y la librería
  function waitForEl(id, cb, timeout = 6000) {
    const t0 = Date.now();
    (function loop(){
      const el = document.getElementById(id);
      if (el) return cb(el);
      if (Date.now() - t0 > timeout) return console.warn('#particles-js no apareció');
      requestAnimationFrame(loop);
    })();
  }
  function waitForParticles(cb, timeout = 6000) {
    const t0 = Date.now();
    (function loop(){
      if (window.particlesJS) return cb();
      if (Date.now() - t0 > timeout) return console.warn('particles.js no cargó');
      requestAnimationFrame(loop);
    })();
  }

  async function loadConfig(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (err) {
      console.warn('No se pudo leer', url, '=> usando FALLBACK_CONFIG. Motivo:', err);
      return FALLBACK_CONFIG;
    }
  }

  async function init() {
    waitForEl('particles-js', async () => {
      waitForParticles(async () => {
        const cfg = await loadConfig('/particlesjs-config.json');
        // Si el CDN provee particlesJS v2, usa esta firma:
        if (typeof window.particlesJS === 'function') {
          // API antigua: particlesJS(id, config)
          window.particlesJS('particles-js', cfg);
        } else if (window.pJSDom) {
          // Compat: intenta método load si existe
          try {
            window.particlesJS.load('particles-js', '/particlesjs-config.json');
          } catch {
            // Cae en la instancia directa si falla
            window.particlesJS('particles-js', cfg);
          }
        }
      });
    });
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();