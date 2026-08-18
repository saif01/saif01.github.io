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
        if (window.innerWidth >= 900) this.setOpen(false);
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
        qsa(`${sel} > .reveal`).forEach((el, index) => {
          el.style.setProperty("--delay", `${index * 70}ms`);
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
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--card-rx", `${(-y * 5).toFixed(2)}deg`);
          card.style.setProperty("--card-ry", `${(x * 6).toFixed(2)}deg`);
        });
        card.addEventListener("pointerleave", () => {
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
      const layers = qsa("[data-career-depth]", map);

      const pauseSignals = () => routes?.pauseAnimations?.();
      const playSignals = () => routes?.unpauseAnimations?.();
      const scheduleSettle = (delay = 11000) => {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(pauseSignals, delay);
      };
      const resetDepth = () => {
        map.style.setProperty("--depth-x", "0px");
        map.style.setProperty("--depth-y", "0px");
        layers.forEach((layer) => {
          layer.style.setProperty("--depth-x", "0px");
          layer.style.setProperty("--depth-y", "0px");
        });
      };
      const paintDepth = () => {
        map.style.setProperty("--depth-x", `${(pointerX * 5).toFixed(2)}px`);
        map.style.setProperty("--depth-y", `${(pointerY * 5).toFixed(2)}px`);
        layers.forEach((layer) => {
          const depth = Number(layer.dataset.careerDepth) || 1;
          layer.style.setProperty("--depth-x", `${(pointerX * depth * 8).toFixed(2)}px`);
          layer.style.setProperty("--depth-y", `${(pointerY * depth * 8).toFixed(2)}px`);
        });
        pointerFrame = 0;
      };

      if (reducedMotion) {
        pauseSignals();
        resetDepth();
        return;
      }

      playSignals();
      scheduleSettle();

      if (window.matchMedia("(pointer: fine)").matches) {
        map.addEventListener("pointerenter", () => {
          playSignals();
          window.clearTimeout(settleTimer);
        });
        map.addEventListener("pointermove", (event) => {
          const rect = map.getBoundingClientRect();
          pointerX = (event.clientX - rect.left) / rect.width - 0.5;
          pointerY = (event.clientY - rect.top) / rect.height - 0.5;
          if (!pointerFrame) pointerFrame = requestAnimationFrame(paintDepth);
        }, { passive: true });
        map.addEventListener("pointerleave", () => {
          resetDepth();
          scheduleSettle(900);
        });
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
