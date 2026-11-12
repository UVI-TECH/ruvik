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

  /* ---------- Diálogo modal reutilizable ----------
     Bloquea el scroll, atrapa el foco, cierra con Esc y devuelve el foco. */
  const FOCUSABLE = 'a[href], button:not([tabindex="-1"]), input, [tabindex="0"]';

  function createModal(root, { panel, initialFocus, onOpen, onClose } = {}) {
    let opener = null;

    function onKeydown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
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

    function open(trigger = document.activeElement) {
      opener = trigger;
      root.hidden = false;
      document.body.classList.add("is-locked");
      document.addEventListener("keydown", onKeydown);
      onOpen?.(trigger);
      initialFocus()?.focus();
    }

    function close({ restoreFocus = true } = {}) {
      if (root.hidden) return;
      root.hidden = true;
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKeydown);
      onClose?.();
      if (restoreFocus && opener && opener.offsetParent !== null) opener.focus();
    }

    return { open, close, isOpen: () => !root.hidden };
  }

  /* ---------- Menú lateral ---------- */
  function initMenu(menu, toggle) {
    const modal = createModal(menu, {
      panel: menu.querySelector(".menu__panel"),
      initialFocus: () => menu.querySelector(".menu__close"),
      onOpen: () => toggle.setAttribute("aria-expanded", "true"),
      onClose: () => toggle.setAttribute("aria-expanded", "false"),
    });

    toggle.addEventListener("click", () => modal.open(toggle));
    menu.querySelectorAll("[data-menu-close]").forEach((el) => el.addEventListener("click", () => modal.close()));
    const close = (opts) => modal.close(opts);

    // Al elegir una opción: cerrar y dejar que el ancla lleve a la sección
    menu.querySelectorAll("a.menu__link").forEach((link) => {
      link.addEventListener("click", () => {
        const hash = link.getAttribute("href");
        close({ restoreFocus: false });
        // Los enlaces a otras páginas (p. ej. buscar.html) navegan solos
        const target = hash.startsWith("#") && hash.length > 1 ? document.querySelector(hash) : null;
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      });
    });

    return modal;
  }

  /* ---------- Búsqueda ----------
     Aún no hay catálogo: toda búsqueda muestra el estado "sin resultados".
     Para conectarla, reemplazar el cuerpo de search() por la consulta real. */
  function initSearch(root, { menuModal } = {}) {
    const form = root.querySelector(".search-form");
    const input = root.querySelector(".search-field__input");
    const title = root.querySelector("#search-title");
    const hint = root.querySelector(".search-modal__hint");
    const result = root.querySelector(".search-result__body");
    const query = root.querySelector(".search-result__query");
    const HINT = hint.textContent;

    const modal = createModal(root, {
      panel: root.querySelector(".search-modal__dialog"),
      initialFocus: () => input,
      onOpen: (trigger) => {
        title.textContent = trigger?.dataset?.searchOpen === "advanced" ? "Búsqueda avanzada" : "Buscar";
        input.select();
      },
    });

    function setHint(text, isError = false) {
      hint.textContent = text;
      hint.classList.toggle("is-error", isError);
    }

    // Con catálogo de ejemplo (js/recursos.js) la búsqueda se resuelve en buscar.html
    function search(term) {
      location.href = "buscar.html?q=" + encodeURIComponent(term);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const term = input.value.trim();
      if (!term) {
        result.hidden = true;
        setHint("Escribe al menos una palabra para buscar.", true);
        input.focus();
        return;
      }
      search(term);
    });

    // Al borrar el texto se limpia el resultado anterior
    input.addEventListener("input", () => {
      if (!input.value.trim()) result.hidden = true;
      if (hint.classList.contains("is-error")) setHint(HINT);
    });

    document.querySelectorAll("[data-search-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (menuModal?.isOpen()) {
          menuModal.close({ restoreFocus: false });
          modal.open(document.getElementById("menu-toggle"));
          title.textContent = "Búsqueda avanzada";
        } else {
          modal.open(btn);
        }
      });
    });

    root.querySelectorAll("[data-search-close]").forEach((el) => el.addEventListener("click", () => modal.close()));
  }

  /* ---------- Contenido sorpresa ----------
     Datos de ejemplo: reemplazar por el catálogo real de recursos y autores. */
  const SURPRISE = {
    resource: [
      { title: "¡Exploremos el entorno de Adobe Illustrator!", href: "recurso.html?r=1" },
      { title: "Narrativas que conectan", href: "recurso.html?r=2" },
      { title: "¿Qué es el diseño editorial?", href: "recurso.html?r=3" },
    ],
    author: [
      { title: "Hellen Zamudio", href: "autores.html?a=hellen-zamudio" },
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
  const menuModal = menu && toggle ? initMenu(menu, toggle) : null;

  const search = document.getElementById("search");
  if (search) initSearch(search, { menuModal });

  const surprise = document.getElementById("sorpresa");
  if (surprise) initSurprise(surprise);
})();
