/* ==========================================================================
   RUVIK · Páginas extra del prototipo
   colecciones.html · autores.html · que-es.html · articulo.html
   Usan el catálogo de js/data.js y los helpers de js/render.js.
   ========================================================================== */

(() => {
  "use strict";

  const R = window.RUVIK;
  const main = document.getElementById("contenido");
  if (!R || !main) return;

  const { esc } = R;
  const page = main.dataset.page;
  const resources = R.resources || [];
  const slug = (s) => R.normalize(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  const LOREM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  ];

  const ARROW = `<span class="arrow" aria-hidden="true">
      <img class="arrow__default" src="assets/icons/arrow.svg" width="22" height="22" alt="">
      <img class="arrow__hover" src="assets/icons/arrow-hover.svg" width="22" height="22" alt="">
    </span>`;

  const shell = (html) => {
    main.innerHTML = `<div class="container page x-page">${html}</div>`;
  };
  const back = (href, label) =>
    `<a class="btn-outline btn-outline--lg t-label-button x-back" href="${href}">${esc(label)}</a>`;

  /* ---------- Colecciones ---------- */
  const collections = () => {
    const filter = (R.filters || []).find((f) => f.key === "coleccion");
    return (filter ? filter.options : []).map(([id, title]) => ({
      id,
      title,
      items: resources.filter((r) => r.facets?.coleccion === id),
    }));
  };

  function collectionCard(c) {
    const cells = c.items.flatMap((r) => r.mosaic).slice(0, 8);
    const grid = cells.map((color, i) => R.cell(color, ["", "bl", "", "tr", "tl", "", "br", ""][i])).join("");
    return `<li><a class="card-collection" href="colecciones.html?c=${esc(c.id)}">
      <div class="card-collection__image mosaic" aria-hidden="true">${grid}</div>
      <div class="card-collection__text">
        <h3 class="card-collection__title t-heading-collection">${esc(c.title)}</h3>
        <span class="card-collection__desc t-body-default">Lorem ipsum dolor sit amet consectetur</span>
        <span class="t-body-small x-muted">${plural(c.items.length, "recurso", "recursos")}</span>
      </div></a></li>`;
  }

  function initCollections() {
    const list = collections();
    const c = list.find((x) => x.id === R.param("c"));
    if (!c) {
      document.title = "Colecciones · RUVIK";
      shell(`<section class="page__section">
          ${R.sectionTitle("Colecciones", { level: 1, color: "pink", shape: "br" })}
          <p class="t-body-default x-muted">Nombres y descripciones de ejemplo, pendientes de definir.</p>
        </section>
        <ul class="x-grid">${list.map(collectionCard).join("")}</ul>`);
      return;
    }
    document.title = `${c.title} · Colecciones · RUVIK`;
    shell(`${back("colecciones.html", "Todas las colecciones")}
      <section class="page__section">
        <h1 class="t-display-h1 x-title">${esc(c.title)}</h1>
        <p class="t-body-lead x-prose">${esc(LOREM[0])}</p>
        <p class="t-body-default x-muted">${plural(c.items.length, "recurso", "recursos")}</p>
      </section>
      <ul class="resource-grid">${c.items.map((r) => R.card(r)).join("")}</ul>`);
  }

  /* ---------- Autores ---------- */
  const authors = () => {
    const map = new Map();
    resources.filter((r) => r.author).forEach((r) => {
      const id = slug(r.author.name);
      if (!map.has(id)) map.set(id, { id, ...r.author, items: [] });
      map.get(id).items.push(r);
    });
    return [...map.values()];
  };
  const avatar = (a) =>
    `<div class="mosaic x-avatar" aria-hidden="true">${a.items[0].mosaic.slice(0, 4).map((c, i) => R.cell(c, ["tl", "", "", "br"][i])).join("")}</div>`;

  function initAuthors() {
    const list = authors();
    const a = list.find((x) => x.id === R.param("a"));
    if (!a) {
      document.title = "Autores · RUVIK";
      const pending = resources.filter((r) => !r.author);
      shell(`<section class="page__section">
          ${R.sectionTitle("Autores", { level: 1, color: "mint", shape: "tl" })}
          <p class="t-body-default x-muted">Profes creadores de los recursos.</p>
        </section>
        <ul class="x-authors">${list.map((x) => `<li><a class="x-author-card" href="autores.html?a=${esc(x.id)}">
          ${avatar(x)}<div><h3 class="t-body-card-title">${esc(x.name)}</h3>
          <p class="t-body-small x-muted">${esc(x.faculty)} · ${plural(x.items.length, "recurso", "recursos")}</p></div>${ARROW}</a></li>`).join("")}</ul>
        ${pending.length ? `<p class="t-body-small x-muted">Autoría por confirmar en ${plural(pending.length, "recurso", "recursos")}.</p>` : ""}`);
      return;
    }
    document.title = `${a.name} · RUVIK`;
    shell(`${back("autores.html", "Todos los autores")}
      <section class="x-author-head">
        ${avatar(a)}
        <div class="x-prose"><p class="t-heading-eyebrow x-eyebrow">${esc(a.cardTitle || "Profe creador")}</p>
          <h1 class="t-display-h1 x-title">${esc(a.name)}</h1>
          <p class="t-body-lead">${esc(a.bio)}</p></div>
      </section>
      <section class="page__section" aria-labelledby="rec-t">
        ${R.sectionTitle("Recursos de este autor", { id: "rec-t", color: "violet", shape: "tr" })}
        <ul class="resource-grid">${a.items.map((r) => R.card(r)).join("")}</ul>
      </section>`);
  }

  /* ---------- ¿Qué es RUVIK? ---------- */
  function initAbout() {
    const steps = [
      ["Busca", "Encuentra recursos por palabra, tipo, facultad o programa."],
      ["Usa", "Abre el recurso, revisa la guía de uso y descarga los materiales."],
      ["Comparte", "Cuenta cómo lo usaste y propón nuevos recursos."],
    ];
    const who = [
      ["Estudiantes", "Consultan recursos para aprender a su ritmo."],
      ["Profes", "Reutilizan recursos en clase y comparten experiencias."],
      ["Creadores", "Publican sus recursos con su autoría y su ficha técnica."],
    ];
    const cards = (items, numbered) =>
      items.map(([t, p], i) => `<li class="panel">${numbered ? `<span class="x-step t-heading-collection">0${i + 1}</span>` : ""}
        <h3 class="t-body-card-title">${t}</h3><p class="t-body-default">${p}</p></li>`).join("");
    shell(`<section class="x-about">
        <p class="t-heading-eyebrow x-eyebrow">RUVIK</p>
        <h1 class="t-display-h1 x-title">¿Qué es RUVIK?</h1>
        <p class="t-body-lead x-prose">Un ecosistema digital para organizar, consultar, compartir y reutilizar recursos educativos.</p>
        <p class="t-body-default x-prose x-muted">${esc(LOREM[0])}</p>
        <a class="btn-cta btn-cta--on-light t-label-cta" href="busqueda.html">Explorar recursos</a>
      </section>
      <section class="page__section" aria-labelledby="como-t">
        ${R.sectionTitle("Cómo funciona", { id: "como-t", color: "cyan", shape: "tl" })}
        <ol class="x-steps">${cards(steps, true)}</ol>
      </section>
      <section class="page__section" aria-labelledby="quien-t">
        ${R.sectionTitle("A quién sirve", { id: "quien-t", color: "orange", shape: "bl" })}
        <ul class="x-steps">${cards(who, false)}</ul>
      </section>`);
  }

  /* ---------- Noticias y experiencias (contenido de ejemplo) ---------- */
  const ARTICLES = [
    { id: "noticia-1", type: "Noticia", title: "Lorem ipsum dolor sit amet consectetur" },
    { id: "noticia-2", type: "Noticia", title: "Sed do eiusmod tempor incididunt ut labore" },
    { id: "experiencia-1", type: "Experiencia", title: "Ut enim ad minim veniam quis nostrud" },
    { id: "experiencia-2", type: "Experiencia", title: "Duis aute irure dolor in reprehenderit" },
  ];

  function initArticle() {
    const a = ARTICLES.find((x) => x.id === R.param("t")) || ARTICLES[0];
    const news = a.type === "Noticia";
    const more = ARTICLES.filter((x) => x.type === a.type && x.id !== a.id);
    document.title = `${a.type} · RUVIK`;
    shell(`${back(`index.html#${news ? "noticias" : "experiencias"}`, "Volver al inicio")}
      <article class="x-article">
        <p class="t-heading-eyebrow x-eyebrow">${a.type}</p>
        <h1 class="t-display-h1 x-title">${esc(a.title)}</h1>
        <img class="x-article__image" src="assets/img/placeholder-${a.id}.jpg" width="960" height="540" alt="">
        <div class="x-prose t-body-lead">${LOREM.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      </article>
      <section class="page__section" aria-labelledby="mas-t">
        ${R.sectionTitle(news ? "Más noticias" : "Más experiencias", { id: "mas-t", color: news ? "orange" : "cyan", shape: news ? "bl" : "tl" })}
        <ul class="card-list x-related">${more.map((x) => `<li><a class="card-news" href="articulo.html?t=${x.id}">
          <img class="card-news__image" src="assets/img/placeholder-${x.id}.jpg" width="960" height="540" loading="lazy" alt="">
          <div class="card-news__row"><h3 class="card-news__title t-body-card-title">${esc(x.title)}</h3>${ARROW}</div></a></li>`).join("")}</ul>
      </section>`);
  }

  ({ colecciones: initCollections, autores: initAuthors, "que-es": initAbout, articulo: initArticle })[page]?.();
})();
