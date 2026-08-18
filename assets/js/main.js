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
    form: "#contact-form",
    year: "#year",
    themeColor: 'meta[name="theme-color"]',
    sections: "main section[id]"
  };

  const THEME_KEY = "portfolio-theme";
  const EMAIL = "syful.cse.bd@gmail.com";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const Theme = {
    getStored() {
      try {
        return localStorage.getItem(THEME_KEY);
      } catch {
        return null;
      }
    },
    preferred() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    current() {
      return document.documentElement.getAttribute("data-theme") || this.preferred();
    },
    apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      const toggle = qs(SELECTORS.themeToggle);
      if (toggle) {
        toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      }
      const meta = qs(SELECTORS.themeColor);
      if (meta) {
        meta.setAttribute("content", theme === "dark" ? "#0b1220" : "#f6f8fb");
      }
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        /* private mode */
      }
    },
    init() {
      this.apply(this.getStored() || this.preferred());
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
    },
    observeSections() {
      const links = qsa(SELECTORS.navLinks);
      const sections = qsa(SELECTORS.sections);
      if (!("IntersectionObserver" in window) || !sections.length) return;

      const setActive = (id) => {
        links.forEach((link) => {
          const match = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("is-active", match);
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

  const Form = {
    init() {
      const form = qs(SELECTORS.form);
      if (!form) return;
      this.form = form;
      this.status = qs(".form-status", form);
      form.addEventListener("submit", (event) => this.onSubmit(event));
      form.addEventListener("input", (event) => {
        const field = event.target.closest(".field");
        if (field?.classList.contains("is-invalid")) this.clearField(field);
      });
    },
    values() {
      const data = new FormData(this.form);
      return {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        subject: String(data.get("subject") || "").trim(),
        message: String(data.get("message") || "").trim()
      };
    },
    validate(values) {
      const errors = {};
      if (values.name.length < 2) errors.name = "Please enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address.";
      if (values.subject.length < 3) errors.subject = "Please add a subject.";
      if (values.message.length < 20) errors.message = "Message should be at least 20 characters.";
      return errors;
    },
    showErrors(errors) {
      qsa(".field", this.form).forEach((field) => {
        const input = qs("input, textarea", field);
        const box = qs(".field-error", field);
        const message = errors[input?.name] || "";
        field.classList.toggle("is-invalid", Boolean(message));
        if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
        if (box) box.textContent = message;
      });
    },
    clearField(field) {
      field.classList.remove("is-invalid");
      const input = qs("input, textarea", field);
      const box = qs(".field-error", field);
      input?.setAttribute("aria-invalid", "false");
      if (box) box.textContent = "";
    },
    setStatus(message, type) {
      if (!this.status) return;
      this.status.textContent = message;
      this.status.classList.remove("is-success", "is-error");
      if (type) this.status.classList.add(`is-${type}`);
    },
    mailto(values) {
      const body = `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`;
      const href = `mailto:${EMAIL}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
    },
    async onSubmit(event) {
      event.preventDefault();
      const values = this.values();
      const errors = this.validate(values);
      this.showErrors(errors);
      if (Object.keys(errors).length) {
        this.setStatus("Please correct the highlighted fields.", "error");
        qs(".field.is-invalid input, .field.is-invalid textarea", this.form)?.focus();
        return;
      }

      const button = qs('button[type="submit"]', this.form);
      if (button) button.disabled = true;
      this.setStatus("Sending…");

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            _subject: values.subject,
            message: values.message,
            _template: "table",
            _captcha: "false"
          })
        });
        if (!response.ok) throw new Error("Request failed");
        this.form.reset();
        this.setStatus("Message sent. Thank you — I will reply shortly.", "success");
      } catch {
        this.mailto(values);
        this.setStatus("Opening your email client to send the message.", "success");
      } finally {
        if (button) button.disabled = false;
      }
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
  Form.init();
  BackToTop.init();
  Footer.init();
})();
