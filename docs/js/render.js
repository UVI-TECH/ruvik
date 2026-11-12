/* ==========================================================================
   RUVIK · Helpers de render compartidos por búsqueda, recurso y visor
   ========================================================================== */

(() => {
  "use strict";

  const R = (window.RUVIK = window.RUVIK || {});

  /* Formas de la "Imagen del recurso" (Figma), fila por fila */
  const SHAPES = ["", "tr", "", "bl", "", "br", "tl", "", "tr"];

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  R.esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

  /* Minúsculas y sin tildes, para comparar textos de búsqueda */
  R.normalize = (text) =>
    String(text ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();

  R.getResource = (id) => (R.resources || []).find((r) => r.id === id) || null;

  R.param = (name) => new URLSearchParams(location.search).get(name);

  R.resourceUrl = (r) => `recurso.html?id=${encodeURIComponent(r.id)}`;
  R.viewerUrl = (r) => `visor.html?id=${encodeURIComponent(r.id)}`;
  R.searchUrl = (q) => (q ? `busqueda.html?q=${encodeURIComponent(q)}` : "busqueda.html");

  /* "Imagen interactiva, Genially" · "Video, Genially y YouTube" */
  R.typeLine = (r) => `${r.type}, ${r.format}`;

  R.cell = (color, shape = "") =>
    `<span class="cell c-${R.esc(color)}${shape ? ` cell--${shape}` : ""}"></span>`;

  /* Mosaico del recurso: 3 filas (imagen completa) o 1 (tarjetas) */
  R.mosaic = (r, { rows = 3, className = "" } = {}) => {
    const cells = r.mosaic.slice(0, rows * 3).map((color, i) => R.cell(color, SHAPES[i])).join("");
    return `<div class="mosaic ${className}" aria-hidden="true">${cells}</div>`;
  };

  const ARROW = `
    <span class="arrow" aria-hidden="true">
      <img class="arrow__default" src="assets/icons/arrow.svg" width="22" height="22" alt="">
      <img class="arrow__hover" src="assets/icons/arrow-hover.svg" width="22" height="22" alt="">
    </span>`;

  /* Tarjeta de recurso (resultados y relacionados) */
  R.card = (r, { headingLevel = 3 } = {}) => `
    <li>
      <a class="card-news card-resource" href="${R.resourceUrl(r)}">
        ${R.mosaic(r, { rows: 1, className: "card-news__image" })}
        <div class="card-resource__text">
          <p class="card-resource__meta t-body-small">${R.esc(r.type)}</p>
          <div class="card-news__row">
            <h${headingLevel} class="card-news__title t-body-card-title">${R.esc(r.title)}</h${headingLevel}>
            ${ARROW}
          </div>
          <p class="card-resource__meta t-body-small">${R.esc(r.faculty)}</p>
        </div>
      </a>
    </li>`;

  /* Título de sección con marcador de mosaico */
  R.sectionTitle = (text, { id = "", level = 2, color = "violet", shape = "tr" } = {}) => `
    <h${level} class="section-title"${id ? ` id="${id}"` : ""}>
      <span class="section-title__marker cell c-${color} cell--${shape}" aria-hidden="true"></span>
      <span class="section-title__text t-heading-section">${R.esc(text)}</span>
    </h${level}>`;

  /* Lista de definición (ficha técnica) */
  R.sheet = (rows, className = "") =>
    `<dl class="sheet ${className}">${rows
      .filter(([, value]) => value)
      .map(
        ([label, value]) =>
          `<div class="sheet__row"><dt class="sheet__label">${R.esc(label)}</dt><dd class="sheet__value">${R.esc(value)}</dd></div>`
      )
      .join("")}</dl>`;

  /* Estado "no encontrado" para recurso y visor */
  R.notFound = (main) => {
    document.title = "Recurso no encontrado · RUVIK";
    main.innerHTML = `
      <div class="container page">
        <div class="search-result__body">
          <span class="search-result__mosaic mosaic" aria-hidden="true">
            ${R.cell("violet", "tl")}${R.cell("yellow")}${R.cell("mint")}${R.cell("pink", "br")}
          </span>
          <div class="search-result__text">
            <h1 class="search-result__title t-body-card-title">No encontramos este recurso</h1>
            <p class="search-result__desc t-body-default">Puede que el enlace esté incompleto. <a class="link" href="busqueda.html">Ir a la búsqueda avanzada</a></p>
          </div>
        </div>
      </div>`;
  };

  /* La búsqueda guarda su URL para que "Volver a resultados" regrese a ella */
  const LAST_SEARCH = "ruvik:last-search";
  R.saveLastSearch = (url) => {
    try {
      sessionStorage.setItem(LAST_SEARCH, url);
    } catch {}
  };
  R.lastSearch = () => {
    try {
      return sessionStorage.getItem(LAST_SEARCH) || "busqueda.html";
    } catch {
      return "busqueda.html";
    }
  };
})();
