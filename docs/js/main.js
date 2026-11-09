/* ==========================================================================
   RUVIK · Interacciones de la Home
   - Carrusel del hero (puntos, flechas de teclado, sin autoplay)
   - Acordeón de preguntas frecuentes
   - Menú lateral (X, Esc, clic fuera, foco atrapado)
   - Contenido sorpresa al azar
   ========================================================================== */

(() => {
  "use strict";

  /* ---------- Carrusel ---------- */
  function initCarousel(root) {
    const slides = [...root.querySelectorAll(".hero__slide")];
    const mosaics = [...root.querySelectorAll(".hero__mosaic")];
    const dots = [...root.querySelectorAll(".hero__dot")];
    if (!slides.length || slides.length !== dots.length) return;

    let current = 0;

    function go(index, { focus = false } = {}) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle("is-active", active);
        slide.inert = !active;
        slide.setAttribute("aria-hidden", String(!active));
      });
      mosaics.forEach((m, i) => m.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => {
        if (i === current) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
        dot.tabIndex = i === current ? 0 : -1;
      });
      if (focus) dots[current].focus();
    }

    dots.forEach((dot, i) => dot.addEventListener("click", () => go(i)));

    root.querySelector(".hero__dots").addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in keys) {
        e.preventDefault();
        go(current + keys[e.key], { focus: true });
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        go(e.key === "Home" ? 0 : slides.length - 1, { focus: true });
      }
    });

    go(0);
  }

  /* ---------- Acordeón FAQ ---------- */
  function initAccordion(root) {
    root.querySelectorAll(".faq__button").forEach((button) => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (!panel) return;
      button.addEventListener("click", () => {
        const open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
    });
  }

  /* ---------- Menú lateral ---------- */
  function initMenu(menu, toggle) {
    const panel = menu.querySelector(".menu__panel");
    const focusableSel = 'a[href], button:not([tabindex="-1"]), [tabindex="0"]';

    function open() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-locked");
      menu.querySelector(".menu__close").focus();
      document.addEventListener("keydown", onKeydown);
    }

    function close({ restoreFocus = true } = {}) {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKeydown);
      if (restoreFocus) toggle.focus();
    }

    function onKeydown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...panel.querySelectorAll(focusableSel)].filter((el) => el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    toggle.addEventListener("click", open);
    menu.querySelectorAll("[data-menu-close]").forEach((el) => el.addEventListener("click", () => close()));

    // Al elegir una opción: cerrar y dejar que el ancla lleve a la sección
    menu.querySelectorAll(".menu__link").forEach((link) => {
      link.addEventListener("click", () => {
        const hash = link.getAttribute("href");
        close({ restoreFocus: false });
        const target = hash.length > 1 ? document.querySelector(hash) : null;
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ---------- Contenido sorpresa ----------
     Datos de ejemplo: reemplazar por el catálogo real de recursos y autores. */
  const SURPRISE = {
    resource: [
      { title: "Recurso de ejemplo A", href: "#" },
      { title: "Recurso de ejemplo B", href: "#" },
      { title: "Recurso de ejemplo C", href: "#" },
    ],
    author: [
      { title: "Autor de ejemplo A", href: "#" },
      { title: "Autor de ejemplo B", href: "#" },
    ],
  };

  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  function initSurprise(root) {
    root.querySelectorAll("[data-random]").forEach((tile) => {
      const kind = tile.dataset.random;
      const pool = kind === "any" ? [...SURPRISE.resource, ...SURPRISE.author] : SURPRISE[kind];
      if (!pool || !pool.length) return;
      const item = pick(pool);
      const label = tile.querySelector(".tile__label").textContent.trim();
      tile.href = item.href;
      tile.setAttribute("aria-label", `${label}: ${item.title}`);
    });
  }

  /* ---------- Arranque ---------- */
  const hero = document.querySelector(".hero");
  if (hero) initCarousel(hero);

  const faq = document.querySelector(".faq");
  if (faq) initAccordion(faq);

  const menu = document.getElementById("menu");
  const toggle = document.getElementById("menu-toggle");
  if (menu && toggle) initMenu(menu, toggle);

  const surprise = document.getElementById("sorpresa");
  if (surprise) initSurprise(surprise);
})();
