(() => {
  "use strict";

  const SELECTORS = {
    header: ".site-header",
    nav: "#site-nav",
    navLinks: ".nav-link",
    menuToggle: "[data-menu-toggle]",
    themeToggle: "[data-theme-toggle]",
    backToTop: "[data-back-to-top]",
    reveal: ".reveal",
    counters: "[data-count]",
    year: "#year",
    themeColor: 'meta[name="theme-color"]',
    sections: "main section[id]",
    scrollProgress: "[data-scroll-progress]",
    tilt: "[data-tilt]",
    careerMap: "[data-career-map]"
  };

  const THEME_KEY = "portfolio-theme";
  // keep in sync with the nav media queries in style.css
  const NAV_BREAKPOINT = 1000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const Theme = {
    getStored() {
      try {
        const stored = localStorage.getItem(THEME_KEY);
        return stored === "light" || stored === "dark" ? stored : null;
      } catch {
        return null;
      }
    },
    current() {
      return document.documentElement.getAttribute("data-theme") || "light";
    },
    apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      const toggle = qs(SELECTORS.themeToggle);
      if (toggle) {
        toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      }
      const meta = qs(SELECTORS.themeColor);
      if (meta) {
        meta.setAttribute("content", theme === "dark" ? "#080d16" : "#f4f7fb");
      }
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        /* private mode */
      }
    },
    init() {
      this.apply(this.getStored() || "light");
      qs(SELECTORS.themeToggle)?.addEventListener("click", () => {
        this.apply(this.current() === "dark" ? "light" : "dark");
      });
    }
  };

  const Nav = {
    header: null,
    nav: null,
    toggle: null,
    init() {
      this.header = qs(SELECTORS.header);
      this.nav = qs(SELECTORS.nav);
      this.toggle = qs(SELECTORS.menuToggle);
      this.onScroll();
      window.addEventListener("scroll", () => this.onScroll(), { passive: true });
      this.toggle?.addEventListener("click", () => this.setOpen(!this.isOpen()));
      qsa(SELECTORS.navLinks).forEach((link) => {
        link.addEventListener("click", () => this.setOpen(false));
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") this.setOpen(false);
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth >= NAV_BREAKPOINT) this.setOpen(false);
      });
      this.observeSections();
    },
    isOpen() {
      return this.toggle?.getAttribute("aria-expanded") === "true";
    },
    setOpen(open) {
      this.toggle?.setAttribute("aria-expanded", String(open));
      this.toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      this.nav?.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    },
    onScroll() {
      this.header?.classList.toggle("is-scrolled", window.scrollY > 12);
      const progress = qs(SELECTORS.scrollProgress);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const value = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        progress.style.setProperty("--scroll-progress", value.toFixed(4));
      }
    },
    observeSections() {
      const links = qsa(SELECTORS.navLinks);
      const sections = qsa(SELECTORS.sections);
      if (!("IntersectionObserver" in window) || !sections.length) return;

      const setActive = (id) => {
        links.forEach((link) => {
          const match = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("is-active", match);
          if (match) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

      sections.forEach((section) => observer.observe(section));
    }
  };

  const Reveal = {
    init() {
      const items = qsa(SELECTORS.reveal);
      const groups = [".about-cards", ".expertise-grid", ".agent-grid", ".project-grid", ".skills-grid", ".education-grid"];
      groups.forEach((sel) => {
        // stagger per grid instance, so a repeated layout (e.g. two .agent-grid
        // blocks) restarts its delay instead of continuing the previous count
        qsa(sel).forEach((grid) => {
          qsa(":scope > .reveal", grid).forEach((el, index) => {
            el.style.setProperty("--delay", `${index * 70}ms`);
          });
        });
      });

      if (reducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
        return;
      }
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
      items.forEach((el) => observer.observe(el));
    }
  };

  const Counters = {
    init() {
      const nodes = qsa(SELECTORS.counters);
      if (!nodes.length) return;
      const run = (el) => {
        const end = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        if (reducedMotion || Number.isNaN(end)) {
          el.textContent = `${end}${suffix}`;
          return;
        }
        const duration = 1100;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          el.textContent = `${Math.round(end * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };

      if (!("IntersectionObserver" in window)) {
        nodes.forEach(run);
        return;
      }
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      nodes.forEach((el) => observer.observe(el));
    }
  };

  const PointerEffects = {
    init() {
      if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

      let frame = 0;
      let pointerX = window.innerWidth * 0.7;
      let pointerY = window.innerHeight * 0.1;
      const paintGlow = () => {
        document.documentElement.style.setProperty("--pointer-x", `${pointerX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${pointerY}px`);
        frame = 0;
      };

      window.addEventListener("pointermove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frame) frame = requestAnimationFrame(paintGlow);
      }, { passive: true });

      qsa(SELECTORS.tilt).forEach((card) => {
        let frame = 0;
        let cardRx = 0;
        let cardRy = 0;
        const paintTilt = () => {
          frame = 0;
          card.style.setProperty("--card-rx", `${cardRx.toFixed(2)}deg`);
          card.style.setProperty("--card-ry", `${cardRy.toFixed(2)}deg`);
        };
        card.addEventListener("pointerenter", () => card.classList.add("is-tilting"));
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          cardRx = -((event.clientY - rect.top) / rect.height - 0.5) * 5;
          cardRy = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
          if (!frame) frame = requestAnimationFrame(paintTilt);
        }, { passive: true });
        card.addEventListener("pointerleave", () => {
          if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
          }
          card.classList.remove("is-tilting");
          card.style.setProperty("--card-rx", "0deg");
          card.style.setProperty("--card-ry", "0deg");
        });
      });
    }
  };

  const CareerMap = {
    init() {
      const card = qs(SELECTORS.careerMap);
      if (!card) return;
      const map = qs(".career-map", card);
      if (!map) return;
      const routes = qs(".career-routes", map);

      let settleTimer = 0;
      let pointerFrame = 0;
      let pointerX = 0;
      let pointerY = 0;
      let easedX = 0;
      let easedY = 0;
      let restFrames = 0;
      const EASE = 0.16;
      const layers = qsa("[data-career-depth]", map);

      const pauseSignals = () => routes?.pauseAnimations?.();
      const playSignals = () => routes?.unpauseAnimations?.();
      const scheduleSettle = (delay = 11000) => {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(pauseSignals, delay);
      };
      // the whole scene shares one tilt axis; each layer only differs in offset
      const setTilt = (axisX, axisY, angle) => {
        map.style.setProperty("--rot-x", axisX);
        map.style.setProperty("--rot-y", axisY);
        map.style.setProperty("--rot-a", angle);
      };
      const resetDepth = () => {
        if (pointerFrame) {
          cancelAnimationFrame(pointerFrame);
          pointerFrame = 0;
        }
        pointerX = 0;
        pointerY = 0;
        easedX = 0;
        easedY = 0;
        setTilt("0", "1", "0deg");
        map.style.setProperty("--depth-x", "0px");
        map.style.setProperty("--depth-y", "0px");
        layers.forEach((layer) => {
          layer.style.setProperty("--depth-x", "0px");
          layer.style.setProperty("--depth-y", "0px");
          layer.style.setProperty("--depth-z", "0px");
        });
      };
      const paintDepth = () => {
        easedX += (pointerX - easedX) * EASE;
        easedY += (pointerY - easedY) * EASE;
        const settled =
          Math.abs(pointerX - easedX) < 0.0008 && Math.abs(pointerY - easedY) < 0.0008;
        if (settled) {
          easedX = pointerX;
          easedY = pointerY;
        }

        // rotate about an axis perpendicular to the cursor offset, so the card
        // leans toward the pointer instead of tilting on fixed X/Y hinges. The
        // hero card already contributes ~6deg of its own, so keep this modest.
        const axisX = -easedY;
        const axisY = easedX;
        const reach = Math.hypot(axisX, axisY);
        const lean = Math.min(reach * 2, 1);
        if (reach < 0.0005) {
          setTilt("0", "1", "0deg");
        } else {
          setTilt(
            (axisX / reach).toFixed(4),
            (axisY / reach).toFixed(4),
            `${(lean * 5).toFixed(2)}deg`
          );
        }
        map.style.setProperty("--depth-x", `${(easedX * 5).toFixed(2)}px`);
        map.style.setProperty("--depth-y", `${(easedY * 5).toFixed(2)}px`);
        layers.forEach((layer) => {
          const depth = Number(layer.dataset.careerDepth) || 1;
          layer.style.setProperty("--depth-x", `${(easedX * depth * 8).toFixed(2)}px`);
          layer.style.setProperty("--depth-y", `${(easedY * depth * 8).toFixed(2)}px`);
          layer.style.setProperty("--depth-z", `${(lean * depth * 26).toFixed(2)}px`);
        });

        // keep the loop alive a few frames past arrival so a resting pointer
        // does not restart it on every micro-move
        restFrames = settled ? restFrames + 1 : 0;
        pointerFrame = restFrames > 2 ? 0 : requestAnimationFrame(paintDepth);
      };
      const requestPaint = () => {
        restFrames = 0;
        if (!pointerFrame) pointerFrame = requestAnimationFrame(paintDepth);
      };

      if (reducedMotion) {
        pauseSignals();
        resetDepth();
        return;
      }

      playSignals();
      scheduleSettle();

      const wake = () => {
        playSignals();
        window.clearTimeout(settleTimer);
      };

      map.addEventListener("pointerenter", wake);

      if (window.matchMedia("(pointer: fine)").matches) {
        map.addEventListener("pointermove", (event) => {
          const rect = map.getBoundingClientRect();
          pointerX = (event.clientX - rect.left) / rect.width - 0.5;
          pointerY = (event.clientY - rect.top) / rect.height - 0.5;
          requestPaint();
        }, { passive: true });
        map.addEventListener("pointerleave", () => {
          // ease back to rest rather than snapping the layers to zero
          pointerX = 0;
          pointerY = 0;
          requestPaint();
          scheduleSettle(900);
        });
      } else {
        map.addEventListener("pointerdown", wake, { passive: true });
        map.addEventListener("pointerup", () => scheduleSettle(4000), { passive: true });
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) pauseSignals();
        else {
          playSignals();
          scheduleSettle(4000);
        }
      });
    }
  };

  const BackToTop = {
    init() {
      const button = qs(SELECTORS.backToTop);
      if (!button) return;
      const toggle = () => button.classList.toggle("is-visible", window.scrollY > 500);
      toggle();
      window.addEventListener("scroll", toggle, { passive: true });
      button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      });
    }
  };

  const Footer = {
    init() {
      const year = qs(SELECTORS.year);
      if (year) year.textContent = String(new Date().getFullYear());
    }
  };

  Theme.init();
  Nav.init();
  Reveal.init();
  Counters.init();
  PointerEffects.init();
  CareerMap.init();
  BackToTop.init();
  Footer.init();
})();
