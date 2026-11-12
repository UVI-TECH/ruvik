/* ==========================================================================
   RUVIK · Páginas internas: Búsqueda, Recurso y Visualizador
   Lee los datos de js/recursos.js (window.RUVIK_RECURSOS).
   Parámetros: buscar.html?q=texto&tipo=...  ·  recurso.html?r=1  ·  visor.html?r=1
   ========================================================================== */

(() => {
  "use strict";

  const DATA = window.RUVIK_RECURSOS || [];
  const params = new URLSearchParams(location.search);
  const byId = (id) => DATA.find((r) => String(r.id) === String(id));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const $ = (sel, root = document) => root.querySelector(sel);

  /* ---------- Piezas compartidas ---------- */
  const SHAPES = ["", "cell--bl", "", "", "cell--tr", "cell--br", "cell--tl", "", ""];

  function mosaic(r, extraClass = "") {
    const cells = r.paleta.map((c, i) => `<span class="cell c-${c} ${SHAPES[(i + r.id) % SHAPES.length]}"></span>`).join("");
    return `<div class="mosaic ${extraClass}" aria-hidden="true">${cells}</div>`;
  }

  function header() {
    return `
    <header class="site-header on-dark" id="inicio">
      <div class="container site-header__inner">
        <div class="site-header__left">
          <div class="site-header__logos">
            <img class="site-header__logo-uniajc" src="assets/logos/uniajc-virtual.svg" width="158" height="44" alt="UNIAJC Virtual">
            <span class="site-header__divider" aria-hidden="true"></span>
            <a href="index.html" aria-label="RUVIK, ir al inicio"><img src="assets/logos/ruvik.svg" width="130" height="44" alt=""></a>
          </div>
        </div>
        <nav class="site-nav" aria-label="Principal">
          <a class="t-label-button" href="que-es.html">¿Qué es?</a>
          <a class="t-label-button" href="colecciones.html">Colecciones</a>
          <a class="t-label-button" href="autores.html">Autores</a>
        </nav>
        <div class="search-group">
          <a class="header-btn header-btn--segment" href="buscar.html" data-focus-search>
            <img class="header-btn__icon" src="assets/icons/search.svg" width="20" height="20" alt="">
            <span class="header-btn__label t-label-button">Buscar</span>
          </a>
          <span class="search-group__divider" aria-hidden="true"></span>
          <a class="header-btn header-btn--segment search-group__advanced" href="buscar.html">
            <span class="t-label-button">Búsqueda avanzada</span>
          </a>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    return `
    <footer class="site-footer on-dark" id="contacto">
      <div class="container site-footer__main">
        <div class="site-footer__info">
          <div class="site-footer__brand">
            <img src="assets/logos/ruvik.svg" width="154" height="52" alt="RUVIK">
            <p class="site-footer__tagline t-body-tagline">Conocimiento que conecta</p>
          </div>
          <div class="site-footer__contact">
            <h2 class="t-heading-section">Info de contacto</h2>
            <address class="site-footer__lines t-body-contact">
              <a class="site-footer__mail" href="mailto:recursosruvik@uniajc.edu.co">recursosruvik@uniajc.edu.co</a>
              <span>Santiago de Cali, Colombia</span>
            </address>
          </div>
        </div>
        <img class="site-footer__mosaic" src="assets/img/mosaic-footer.svg" width="224" height="224" alt="">
      </div>
      <div class="container site-footer__bottom">
        <div class="site-footer__logos">
          <img src="assets/logos/institucional.png" width="74" height="32" alt="Institución Universitaria Antonio José Camacho">
          <img src="assets/logos/uniajc-virtual.svg" width="115" height="32" alt="UNIAJC Virtual">
        </div>
      </div>
    </footer>`;
  }

  function sectionTitle(text, color, shape, id) {
    return `<h2 class="section-title"${id ? ` id="${id}"` : ""}>
      <span class="section-title__marker cell c-${color} cell--${shape}" aria-hidden="true"></span>
      <span class="section-title__text t-heading-section">${esc(text)}</span>
    </h2>`;
  }

  const arrow = `<span class="arrow" aria-hidden="true">
      <img class="arrow__default" src="assets/icons/arrow.svg" width="22" height="22" alt="">
      <img class="arrow__hover" src="assets/icons/arrow-hover.svg" width="22" height="22" alt="">
    </span>`;

  function card(r) {
    return `<li>
      <a class="card-news card-result" href="recurso.html?r=${r.id}">
        ${mosaic(r, "card-news__image")}
        <p class="card-result__meta t-body-small">${esc(r.tipo)}${r.duracion && r.duracion !== "No aplica" ? " · " + esc(r.duracion) : ""}</p>
        <div class="card-news__row">
          <h3 class="card-news__title t-body-card-title">${esc(r.titulo)}</h3>
          ${arrow}
        </div>
        <p class="card-result__faculty t-body-small">${esc(r.facultad)}</p>
      </a>
    </li>`;
  }

  function mount() {
    const h = $("#slot-header");
    const f = $("#slot-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
  }

  /* ---------- Búsqueda ---------- */
  function initSearchPage() {
    const form = $("#form-busqueda");
    const input = $("#q");
    const list = $("#resultados");
    const count = $("#conteo");
    const empty = $("#sin-resultados");
    const emptyQ = $("#sin-resultados-q");
    const clear = $("#limpiar");
    const facets = { tipo: $("#f-tipo"), facultad: $("#f-facultad"), programa: $("#f-programa") };

    const uniq = (key) => [...new Set(DATA.map((r) => r[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
    Object.entries(facets).forEach(([key, el]) => {
      uniq(key).forEach((v) => el.insertAdjacentHTML("beforeend", `<option value="${esc(v)}">${esc(v)}</option>`));
    });

    input.value = params.get("q") || "";
    Object.entries(facets).forEach(([key, el]) => { if (params.get(key)) el.value = params.get(key); });

    function run() {
      const q = norm(input.value.trim());
      const found = DATA.filter((r) => {
        if (facets.tipo.value && r.tipo !== facets.tipo.value) return false;
        if (facets.facultad.value && r.facultad !== facets.facultad.value) return false;
        if (facets.programa.value && r.programa !== facets.programa.value) return false;
        if (!q) return true;
        const hay = norm([r.titulo, r.sinopsis, r.creador, r.asignatura, r.programa, r.facultad, r.tipo, r.etiquetas.join(" ")].join(" "));
        return q.split(/\s+/).every((w) => hay.includes(w));
      });
      list.innerHTML = found.map(card).join("");
      count.textContent = found.length === 1 ? "1 recurso encontrado" : `${found.length} recursos encontrados`;
      empty.hidden = found.length > 0;
      emptyQ.textContent = input.value.trim() || "estos filtros";
      const url = new URL(location.href);
      url.search = "";
      if (input.value.trim()) url.searchParams.set("q", input.value.trim());
      Object.entries(facets).forEach(([key, el]) => el.value && url.searchParams.set(key, el.value));
      history.replaceState(null, "", url);
    }

    form.addEventListener("submit", (e) => { e.preventDefault(); run(); });
    Object.values(facets).forEach((el) => el.addEventListener("change", run));
    clear.addEventListener("click", () => {
      input.value = "";
      Object.values(facets).forEach((el) => (el.value = ""));
      run();
      input.focus();
    });
    document.querySelectorAll("[data-focus-search]").forEach((a) =>
      a.addEventListener("click", (e) => { e.preventDefault(); input.focus(); }));
    run();
  }

  /* ---------- Recurso ---------- */
  function para(text) {
    return String(text || "").split(/\n+/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("");
  }

  function field(k, v) {
    return `<div class="ficha__row"><dt class="t-body-small">${esc(k)}</dt><dd class="t-body-default">${esc(v)}</dd></div>`;
  }

  function initResourcePage() {
    const r = byId(params.get("r")) || DATA[0];
    if (!r) return;
    document.title = `${r.titulo} · RUVIK`;
    const isVideo = /video/i.test(r.tipo);
    const dur = r.duracion && r.duracion !== "No aplica" ? ` · ${r.duracion}` : "";
    const others = DATA.filter((x) => x.id !== r.id);
    const creator = r.creador
      ? `<h3 class="t-body-card-title">${esc(r.creador)}</h3><p class="t-body-default">${esc(r.bio)}</p>`
      : `<h3 class="t-body-card-title">Información por confirmar</h3><p class="t-body-default muted">Aún no hay biografía registrada.</p>`;

    $("#recurso").innerHTML = `
      <div class="container page-top">
        <a class="back-link t-label-button" href="buscar.html"><img src="assets/icons/arrow.svg" width="18" height="18" alt="" class="back-link__icon">Volver a resultados</a>
      </div>

      <section class="container resource-hero" aria-labelledby="r-titulo">
        ${mosaic(r, "resource-hero__image")}
        <div class="resource-hero__info">
          <p class="t-heading-eyebrow resource-hero__type">${esc(r.tipo)} · ${esc(r.formato)}${esc(dur)}</p>
          <h1 class="t-display-h1 resource-hero__title" id="r-titulo">${esc(r.titulo)}</h1>
          <div class="prose t-body-lead">${para(r.sinopsis)}</div>
          <div class="resource-hero__actions">
            <a class="btn-cta t-label-cta btn-cta--violet" href="visor.html?r=${r.id}">Ver recurso</a>
            <a class="link-quiet t-label-button" href="#como-usar">¿Cómo usar este recurso?</a>
          </div>
          ${r.etiquetas.length ? `<ul class="chips" aria-label="Etiquetas">${r.etiquetas.map((t) => `<li><a class="chip t-body-small" href="buscar.html?q=${encodeURIComponent(t.replace(/^#/, ""))}">${esc(t)}</a></li>`).join("")}</ul>` : ""}
        </div>
      </section>

      <section class="container panels" aria-label="Objetivo y uso">
        <div class="panel">
          ${sectionTitle("Objetivo pedagógico", "mint", "tr")}
          <div class="prose t-body-default">${para(r.objetivo)}</div>
        </div>
        <div class="panel" id="como-usar">
          ${sectionTitle("¿Cómo usar este recurso?", "yellow", "bl")}
          <div class="prose t-body-default">${para(r.como)}</div>
        </div>
      </section>

      <section class="container ficha-grid" aria-labelledby="ficha-t">
        <div class="ficha-block">
          ${sectionTitle("Ficha técnica", "cyan", "tl", "ficha-t")}
          <dl class="ficha">
            ${field("Tipo de recurso", r.tipo)}
            ${field("Formato", r.formato)}
            ${r.duracion && r.duracion !== "No aplica" ? field("Duración", r.duracion) : ""}
            ${field("Año", r.anio)}
            ${field("Facultad", r.facultad)}
            ${field("Programa", r.programa)}
            ${field("Asignatura", r.asignatura)}
            ${field("Proyecto", r.proyecto)}
            ${field("Asesoría", r.asesor)}
            ${field("Uso de IA", r.ia)}
          </dl>
          <p class="t-body-small muted">Faltan por definir en la ficha: tipo de RED, colección, licencia y acceso.</p>
        </div>
        <aside class="creator panel" aria-labelledby="creador-t">
          ${sectionTitle("Profe creador", "pink", "br", "creador-t")}
          ${creator}
          <a class="link-quiet t-label-button" href="buscar.html?q=${encodeURIComponent(r.creador || "")}">Más del autor</a>
        </aside>
      </section>

      <section class="container" aria-labelledby="exp-t">
        ${sectionTitle("Experiencias de uso", "orange", "tr", "exp-t")}
        <div class="empty">
          <div class="mosaic empty__mosaic" aria-hidden="true"><span class="cell c-violet cell--tl"></span><span class="cell c-yellow"></span><span class="cell c-mint"></span><span class="cell c-pink cell--br"></span></div>
          <div>
            <p class="t-body-card-title">Aún no hay experiencias registradas</p>
            <p class="t-body-default muted">Cuando alguien use este recurso en clase, su experiencia aparecerá aquí.</p>
          </div>
          <a class="btn-cta t-label-cta btn-cta--navy" href="mailto:recursosruvik@uniajc.edu.co?subject=${encodeURIComponent("Mi experiencia con " + r.titulo)}">Compartir mi experiencia</a>
        </div>
      </section>

      <section class="container" aria-labelledby="com-t">
        ${sectionTitle("Comentarios", "lilac", "bl", "com-t")}
        <form class="comment-form" id="form-comentario">
          <label class="visually-hidden" for="comentario">Tu comentario</label>
          <textarea id="comentario" class="comment-form__field t-body-default" rows="3" placeholder="Escribe tu comentario"></textarea>
          <button class="btn-cta t-label-cta btn-cta--navy" type="submit">Publicar comentario</button>
        </form>
        <ul class="comments" id="comentarios"></ul>
        <p class="t-body-default muted" id="sin-comentarios">Aún no hay comentarios. Sé la primera persona en comentar.</p>
        <p class="t-body-small muted">Prototipo: los comentarios se muestran solo en esta página y no se guardan.</p>
      </section>

      <section class="container" aria-labelledby="rel-t">
        ${sectionTitle("Recursos relacionados", "red-orange", "tl", "rel-t")}
        <ul class="card-list related">${others.map(card).join("")}</ul>
      </section>`;

    const form = $("#form-comentario");
    const lista = $("#comentarios");
    const vacio = $("#sin-comentarios");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const txt = $("#comentario").value.trim();
      if (!txt) { $("#comentario").focus(); return; }
      lista.insertAdjacentHTML("afterbegin", `<li class="comment"><p class="t-body-small muted">Tú · ahora</p><p class="t-body-default">${esc(txt)}</p></li>`);
      $("#comentario").value = "";
      vacio.hidden = true;
    });
  }

  /* ---------- Visualizador ---------- */
  function initViewerPage() {
    const r = byId(params.get("r")) || DATA[0];
    if (!r) return;
    document.title = `${r.titulo} · Visualizador · RUVIK`;
    const dur = r.duracion && r.duracion !== "No aplica" ? ` · ${r.duracion}` : "";

    $("#visor").innerHTML = `
      <div class="container viewer-head">
        <a class="back-link t-label-button" href="recurso.html?r=${r.id}"><img src="assets/icons/arrow.svg" width="18" height="18" alt="" class="back-link__icon">Volver al recurso</a>
        <h1 class="t-body-card-title viewer-head__title">${esc(r.titulo)}</h1>
      </div>

      <div class="container viewer">
        <div class="viewer__main">
          <div class="viewer__bar">
            <span class="badge t-body-small">${esc(r.tipo)}${esc(dur)}</span>
            <a class="btn-outline t-label-button" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Abrir en Genially</a>
            <button class="btn-outline t-label-button" type="button" id="pantalla-completa">Pantalla completa</button>
          </div>
          <div class="viewer__stage" id="escenario">
            <iframe id="genially" class="viewer__frame" src="${esc(r.url)}" title="${esc(r.titulo)}" loading="lazy" allowfullscreen allow="fullscreen; autoplay"></iframe>
          </div>
          <p class="t-body-small muted">Si el recurso no se carga aquí, ábrelo con “Abrir en Genially”.</p>
        </div>

        <aside class="viewer__side">
          <section class="panel" aria-labelledby="arch-t">
            ${sectionTitle("Archivos y documentos", "yellow", "tr", "arch-t")}
            <ul class="files">
              <li class="file">
                <div class="file__row">${mosaic({ ...r, id: 1, paleta: r.paleta.slice(0, 4) }, "file__thumb")}<div><p class="t-body-card-title">${esc(r.titulo)}</p><p class="t-body-small muted">${esc(r.formato)}</p></div></div>
                <a class="btn-outline t-label-button" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Abrir recurso</a>
              </li>
              <li class="file">
                <div class="file__row">${mosaic({ ...r, id: 2, paleta: r.paleta.slice(4, 8) }, "file__thumb")}<div><p class="t-body-card-title">Cómo usar y evaluar este recurso</p><p class="t-body-small muted">PDF</p></div></div>
                <a class="btn-outline t-label-button" href="assets/pdf/${esc(r.pdf)}" download>Descargar</a>
              </li>
            </ul>
          </section>
          <section class="panel" aria-labelledby="fic-t">
            ${sectionTitle("Ficha técnica", "cyan", "tl", "fic-t")}
            <dl class="ficha">
              ${field("Tipo de recurso", r.tipo)}
              ${field("Autoría", r.creador || "Sin registrar")}
              ${field("Facultad", r.facultad)}
              ${field("Programa", r.programa)}
              ${field("Asignatura", r.asignatura)}
              ${field("Año", r.anio)}
              ${field("Uso de IA", r.ia)}
            </dl>
          </section>
        </aside>
      </div>`;

    const stage = $("#escenario");
    $("#pantalla-completa").addEventListener("click", () => {
      if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
    });
  }


  /* ---------- Noticias y experiencias (contenido de ejemplo) ---------- */
  const ARTICULOS = [
    { id: "noticia-1", tipo: "Noticia", titulo: "Lorem ipsum dolor sit amet consectetur", color: "orange", shape: "bl" },
    { id: "noticia-2", tipo: "Noticia", titulo: "Sed do eiusmod tempor incididunt ut labore", color: "orange", shape: "bl" },
    { id: "experiencia-1", tipo: "Experiencia", titulo: "Ut enim ad minim veniam quis nostrud", color: "cyan", shape: "tl" },
    { id: "experiencia-2", tipo: "Experiencia", titulo: "Duis aute irure dolor in reprehenderit", color: "cyan", shape: "tl" },
  ];
  const LOREM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  ];

  function initArticlePage() {
    const a = ARTICULOS.find((x) => x.id === params.get("t")) || ARTICULOS[0];
    const same = ARTICULOS.filter((x) => x.tipo === a.tipo && x.id !== a.id);
    document.title = `${a.tipo} · RUVIK`;
    $("#articulo").innerHTML = `
      <div class="container page-top">
        <a class="back-link t-label-button" href="index.html#${a.tipo === "Noticia" ? "noticias" : "experiencias"}"><img src="assets/icons/arrow.svg" width="18" height="18" alt="" class="back-link__icon">Volver al inicio</a>
      </div>
      <article class="container article">
        <header class="article__head">
          <p class="t-heading-eyebrow resource-hero__type">${esc(a.tipo)}</p>
          <h1 class="t-display-h1 article__title">${esc(a.titulo)}</h1>
        </header>
        <img class="article__image" src="assets/img/placeholder-${a.id}.jpg" width="960" height="540" alt="">
        <div class="prose t-body-lead">${LOREM.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      </article>
      <section class="container" aria-labelledby="mas-t">
        ${sectionTitle(a.tipo === "Noticia" ? "Más noticias" : "Más experiencias", a.color, a.shape, "mas-t")}
        <ul class="card-list related">${same.map((x) => `<li><a class="card-news" href="articulo.html?t=${x.id}">
          <img class="card-news__image" src="assets/img/placeholder-${x.id}.jpg" width="960" height="540" loading="lazy" alt="">
          <div class="card-news__row"><h3 class="card-news__title t-body-card-title">${esc(x.titulo)}</h3>${arrow}</div></a></li>`).join("")}</ul>
      </section>`;
  }

  /* ---------- Colecciones ---------- */
  const COLS = window.RUVIK_COLECCIONES || [];

  function collectionCard(c) {
    const items = c.recursos.map(byId).filter(Boolean);
    const cells = (items.length ? items : [{ id: 1, paleta: ["violet"] }]).flatMap((r) => r.paleta.slice(0, 8)).slice(0, 8);
    const grid = cells.map((col, i) => `<span class="cell c-${col} ${SHAPES[(i + 2) % SHAPES.length]}"></span>`).join("");
    return `<li><a class="card-collection" href="colecciones.html?c=${c.id}">
      <div class="card-collection__image mosaic" aria-hidden="true">${grid}</div>
      <div class="card-collection__text">
        <h3 class="card-collection__title t-heading-collection">${esc(c.titulo)}</h3>
        <span class="card-collection__desc t-body-default">${esc(c.desc)}</span>
        <span class="t-body-small muted">${items.length} ${items.length === 1 ? "recurso" : "recursos"}</span>
      </div></a></li>`;
  }

  function initCollectionsPage() {
    const c = COLS.find((x) => x.id === params.get("c"));
    if (!c) {
      document.title = "Colecciones · RUVIK";
      $("#colecciones").innerHTML = `
        <div class="container page-top">${sectionTitle("Colecciones", "pink", "br", "col-t")}
          <p class="t-body-default muted">Nombres y descripciones de ejemplo, pendientes de definir.</p></div>
        <div class="container"><ul class="collections__grid">${COLS.map(collectionCard).join("")}</ul></div>`;
      return;
    }
    document.title = `${c.titulo} · Colecciones · RUVIK`;
    const items = c.recursos.map(byId).filter(Boolean);
    $("#colecciones").innerHTML = `
      <div class="container page-top">
        <a class="back-link t-label-button" href="colecciones.html"><img src="assets/icons/arrow.svg" width="18" height="18" alt="" class="back-link__icon">Todas las colecciones</a>
        <h1 class="t-display-h1 article__title">${esc(c.titulo)}</h1>
        <p class="t-body-lead prose">${esc(c.desc)}</p>
        <p class="t-body-default muted">${items.length} ${items.length === 1 ? "recurso" : "recursos"}</p>
      </div>
      <div class="container"><ul class="results-grid">${items.map(card).join("")}</ul></div>`;
  }

  /* ---------- Autores ---------- */
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function authors() {
    const map = new Map();
    DATA.filter((r) => r.creador).forEach((r) => {
      const k = slug(r.creador);
      if (!map.has(k)) map.set(k, { id: k, nombre: r.creador, bio: r.bio, programa: r.programa, recursos: [] });
      map.get(k).recursos.push(r);
    });
    return [...map.values()];
  }
  function avatar(a) {
    const r = a.recursos[0];
    return mosaic({ ...r, id: 3, paleta: r.paleta.slice(0, 4) }, "avatar");
  }

  function initAuthorsPage() {
    const list = authors();
    const a = list.find((x) => x.id === params.get("a"));
    const pending = DATA.filter((r) => !r.creador);
    if (!a) {
      document.title = "Autores · RUVIK";
      $("#autores").innerHTML = `
        <div class="container page-top">${sectionTitle("Autores", "mint", "tl", "aut-t")}
          <p class="t-body-default muted">Profes creadores de los recursos.</p></div>
        <div class="container"><ul class="authors">${list.map((x) => `<li><a class="author-card" href="autores.html?a=${x.id}">
          ${avatar(x)}<div><h3 class="t-body-card-title">${esc(x.nombre)}</h3><p class="t-body-small muted">${esc(x.programa)} · ${x.recursos.length} ${x.recursos.length === 1 ? "recurso" : "recursos"}</p></div>${arrow}</a></li>`).join("")}</ul>
          ${pending.length ? `<p class="t-body-small muted">Autoría por confirmar en ${pending.length} ${pending.length === 1 ? "recurso" : "recursos"}: ${pending.map((r) => esc(r.titulo)).join("; ")}.</p>` : ""}</div>`;
      return;
    }
    document.title = `${a.nombre} · RUVIK`;
    $("#autores").innerHTML = `
      <div class="container page-top">
        <a class="back-link t-label-button" href="autores.html"><img src="assets/icons/arrow.svg" width="18" height="18" alt="" class="back-link__icon">Todos los autores</a>
      </div>
      <section class="container author-head">
        ${avatar(a)}
        <div class="prose"><p class="t-heading-eyebrow resource-hero__type">Profe creador</p>
          <h1 class="t-display-h1 article__title">${esc(a.nombre)}</h1>
          <p class="t-body-lead">${esc(a.bio)}</p></div>
      </section>
      <section class="container" aria-labelledby="rec-t">${sectionTitle("Recursos de este autor", "violet", "tr", "rec-t")}
        <ul class="results-grid">${a.recursos.map(card).join("")}</ul></section>`;
  }

  /* ---------- ¿Qué es RUVIK? ---------- */
  function initAboutPage() {
    const steps = [
      ["Busca", "Encuentra recursos por palabra, tipo, facultad o programa.", "violet", "tr"],
      ["Usa", "Abre el recurso, revisa la guía de uso y descarga los materiales.", "yellow", "bl"],
      ["Comparte", "Cuenta cómo lo usaste y propón nuevos recursos.", "mint", "br"],
    ];
    const who = [
      ["Estudiantes", "Consultan recursos para aprender a su ritmo."],
      ["Profes", "Reutilizan recursos en clase y comparten experiencias."],
      ["Creadores", "Publican sus recursos con su autoría y su ficha técnica."],
    ];
    $("#que-es").innerHTML = `
      <section class="container about-hero">
        <p class="t-heading-eyebrow resource-hero__type">RUVIK</p>
        <h1 class="t-display-h1 article__title">¿Qué es RUVIK?</h1>
        <p class="t-body-lead prose">Un ecosistema digital para organizar, consultar, compartir y reutilizar recursos educativos.</p>
        <p class="t-body-default prose muted">${LOREM[0]}</p>
        <a class="btn-cta t-label-cta btn-cta--violet" href="buscar.html">Explorar recursos</a>
      </section>
      <section class="container" aria-labelledby="como-t">${sectionTitle("Cómo funciona", "cyan", "tl", "como-t")}
        <ol class="steps">${steps.map(([t, p, c, s], i) => `<li class="panel"><span class="steps__n t-heading-collection">0${i + 1}</span>
          <h3 class="t-body-card-title">${t}</h3><p class="t-body-default">${p}</p></li>`).join("")}</ol></section>
      <section class="container" aria-labelledby="quien-t">${sectionTitle("A quién sirve", "orange", "bl", "quien-t")}
        <ul class="steps">${who.map(([t, p]) => `<li class="panel"><h3 class="t-body-card-title">${t}</h3><p class="t-body-default">${p}</p></li>`).join("")}</ul></section>`;
  }

  /* ---------- Arranque ---------- */
  mount();
  const page = document.body.dataset.page;
  if (page === "buscar") initSearchPage();
  if (page === "recurso") initResourcePage();
  if (page === "visor") initViewerPage();
  if (page === "articulo") initArticlePage();
  if (page === "colecciones") initCollectionsPage();
  if (page === "autores") initAuthorsPage();
  if (page === "que-es") initAboutPage();
})();
