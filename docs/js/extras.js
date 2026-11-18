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


  /* Créditos del área UVI: nombres de ejemplo hasta tener la lista real */
  const CREDITS = [
    ["Dirección del área", ["Jhon Doe"]],
    ["Acompañamiento estratégico (Deck Lab)", ["Ana María Villar"]],
    ["Coordinación académica", ["Jhon Doe", "Jhon Doe"]],
    ["Diseño instruccional", ["Jhon Doe", "Jhon Doe"]],
    ["Diseño gráfico y multimedia", ["Jhon Doe", "Jhon Doe"]],
    ["Desarrollo y UX", ["Jhon Doe"]],
    ["Asesoría docente", ["Jhon Doe", "Jhon Doe"]],
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

  /* Collage: las portadas de la colección superpuestas, sin rejilla */
  function collage(items) {
    const covers = items.map((r) => r.cover).filter(Boolean).slice(0, 4);
    return covers.map((src) => `<img src="${esc(src)}" alt="" loading="lazy">`).join("");
  }

  function collectionCard(c) {
    return `<li><a class="card-collection" href="colecciones.html?c=${esc(c.id)}">
      <div class="card-collection__image collage collage--${Math.min(c.items.length, 4)}" aria-hidden="true">${collage(c.items)}</div>
      <div class="card-collection__text">
        <h3 class="card-collection__title t-heading-collection">${esc(c.title)}</h3>
        <span class="card-collection__desc t-body-default">${esc((R.collectionInfo || {})[c.id] || "")}</span>
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
          <p class="t-body-default x-muted">Colecciones de ejemplo armadas con los recursos actuales; nombres y descripciones por confirmar.</p>
        </section>
        <ul class="x-grid">${list.map(collectionCard).join("")}</ul>`);
      return;
    }
    document.title = `${c.title} · Colecciones · RUVIK`;
    shell(`${back("colecciones.html", "Todas las colecciones")}
      <section class="page__section">
        <h1 class="t-display-h1 x-title">${esc(c.title)}</h1>
        <p class="t-body-lead x-prose">${esc((R.collectionInfo || {})[c.id] || "")}</p>
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
    const p = (t) => `<p class="t-body-default x-text">${t}</p>`;
    const section = (id, title, color, shape, body) => `<section class="page__section" aria-labelledby="${id}-t" id="${id}">
        ${R.sectionTitle(title, { id: `${id}-t`, color, shape })}
        ${body}
      </section>`;
    const steps = [
      ["Explora", "Navega libremente por colecciones y curadurías, o busca directo con la búsqueda avanzada."],
      ["Usa", "Abre el recurso, revisa la guía de uso y descarga los materiales."],
      ["Comparte", "Cuenta cómo lo usaste y conversa en los comentarios de cada recurso."],
    ];
    const who = [
      ["Profesores", "Encuentran, reutilizan y adaptan recursos, y comparten sus experiencias de creación y uso."],
      ["Estudiantes", "Consultan recursos para aprender y explorar según su contexto y sus necesidades."],
      ["Comunidad interesada", "Personas de dentro y fuera de la institución interesadas en la educación y en las prácticas pedagógicas."],
    ];
    const cards = (items, numbered) =>
      items.map(([t, x], i) => `<li class="panel">${numbered ? `<span class="x-step t-heading-collection">0${i + 1}</span>` : ""}
        <h3 class="t-body-card-title">${t}</h3><p class="t-body-default">${x}</p></li>`).join("");

    shell(`<section class="x-about">
        <p class="t-heading-eyebrow x-eyebrow">RUVIK</p>
        <h1 class="t-display-h1 x-title">¿Qué es RUVIK?</h1>
        <p class="t-body-lead x-prose">Ruvik es el Banco de Recursos Educativos Digitales de la Institución Universitaria Antonio José Camacho.</p>
        <p class="t-body-default x-prose x-muted">Su objetivo es reunir, clasificar, curar y poner a disposición de la comunidad educativa institucional y externa un conjunto amplio de recursos educativos, tanto abiertos como cerrados, que fortalezcan los procesos de enseñanza, aprendizaje, investigación e innovación pedagógica.</p>
        <a class="btn-cta btn-cta--on-light t-label-cta" href="busqueda.html">Explorar recursos</a>
      </section>
      ${section("abierto-cerrado", "Un banco abierto y cerrado", "cyan", "tl", `<div class="x-steps">
        <div class="panel"><h3 class="t-body-card-title">Componente abierto</h3><p class="t-body-default">Promueve el acceso libre al conocimiento con Recursos Educativos Abiertos (REA): se pueden consultar, descargar, reutilizar y adaptar bajo licencias abiertas, en favor de la democratización del saber y la proyección social de UNICAMACHO.</p></div>
        <div class="panel"><h3 class="t-body-card-title">Componente cerrado</h3><p class="t-body-default">Centraliza Recursos Educativos Digitales de uso interno, diseñados por expertos asociados y validados con los saberes, macrosaberes y lineamientos pedagógicos institucionales, para garantizar pertinencia, calidad y coherencia curricular.</p></div>
      </div>`)}
      ${section("experiencia", "Experiencia y comunidad", "orange", "bl", p("Ruvik no es solo un repositorio: es una experiencia que articula recursos, personas y prácticas educativas. Está dirigido a profesores, estudiantes y demás personas interesadas en la educación, y busca que los recursos puedan explorarse, usarse, compartirse y apropiarse según las necesidades de cada contexto.") + p("Es el punto de partida para construir, poco a poco, una comunidad en torno al conocimiento: promueve la circulación y reutilización de los recursos, el intercambio entre sus participantes y la creación de nuevos conocimientos y prácticas pedagógicas. Así, los recursos no solo se conservan: se activan, circulan y adquieren nuevos sentidos."))}
      ${section("identidad", "Identidad", "pink", "br", p("Su nombre evoca el cubo de Rubik: un rompecabezas de colores vibrantes cuya estructura, aparentemente simple, se compone de piezas que se reorganizan mediante el movimiento y la combinación. La identidad visual de Ruvik se construye alrededor de la geometría, la lógica, la articulación y la modularidad, con una imagen contemporánea y organizada, propia de una Smart University, pero cercana, amable y dinámica.") + p("Ese es su espíritu: mover, explorar, combinar, transformar y crear nuevas posibilidades. Ruvik parte de una estructura organizada, pero flexible y abierta a múltiples configuraciones, como una comunidad y un banco de recursos en permanente construcción."))}
      ${section("uso-critico", "Creación, apropiación y uso crítico de las tecnologías", "violet", "tr", p("Además de reunir y cuidar los recursos, Ruvik promoverá su creación con actividades, talleres y laboratorios para que profesores y profesoras desarrollen sus propios recursos educativos, y ofrecerá herramientas y orientaciones para evaluarlos, con criterios de calidad reconocidos internacionalmente y ajustados al contexto local.") + p("Promoverá un uso crítico, creativo y responsable de las tecnologías, y el diálogo entre lo digital y lo análogo, entre lo tecnológico y lo material, con las personas, sus contextos y sus territorios en el centro.") + p("Frente a la inteligencia artificial, en particular la generativa, mantendrá una posición activa, crítica y reflexiva: reconocer sus aportes, pero también sus riesgos, limitaciones y usos inadecuados. Para ello consulta a la comunidad y toma como referente una escala de cinco niveles de uso de la IA (Perkins, Furze, Roe y MacVaugh, 2024, <a class=\"link\" href=\"https://doi.org/10.53761/q3azde36\" target=\"_blank\" rel=\"noopener\">doi.org/10.53761/q3azde36</a>)."))}
      <section class="page__section" aria-labelledby="como-t">
        ${R.sectionTitle("Cómo funciona", { id: "como-t", color: "mint", shape: "tl" })}
        <ol class="x-steps">${cards(steps, true)}</ol>
      </section>
      <section class="page__section" aria-labelledby="quien-t">
        ${R.sectionTitle("A quién sirve", { id: "quien-t", color: "orange", shape: "bl" })}
        <ul class="x-steps">${cards(who, false)}</ul>
      </section>
      <section class="page__section" aria-labelledby="quienes-t" id="quienes-somos">
        ${R.sectionTitle("Quiénes somos", { id: "quienes-t", color: "violet", shape: "tr" })}
        <p class="t-body-default x-prose">Créditos del área UVI (Unidad Virtual de Innovación) de UNICAMACHO, con el apoyo del Eje de Innovación Educativa y el acompañamiento estratégico del Deck Lab. Los nombres de ejemplo se reemplazarán por los reales.</p>
        <ul class="x-credits">${CREDITS.map(([role, names]) => `<li class="panel">
            <h3 class="t-body-card-title">${role}</h3>
            <ul class="x-credit-list">${names.map((n) => `<li><span class="x-initials" aria-hidden="true">${n.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span><span class="t-body-default">${n}</span></li>`).join("")}</ul>
          </li>`).join("")}</ul>
      </section>`);
  }

  /* ---------- Noticias y experiencias ---------- */
  const ARTICLES = [
    {
      id: "noticia-1", type: "Noticia",
      title: "Primer laboratorio Ruvik de creación de recursos educativos digitales",
      image: "noticia-laboratorio-ruvik.webp",
      alt: "Una facilitadora presenta los criterios de calidad de los contenidos a un grupo de profesores en un auditorio.",
      body: ["El mes pasado se desarrolló el primer laboratorio Ruvik de creación de recursos educativos digitales, con la participación de 20 profesores de la UNICAMACHO."],
    },
    {
      id: "noticia-2", type: "Noticia",
      title: "¡Seguimos sumando recursos! Llegaron 10 nuevos recursos",
      image: "placeholder-noticia-2.jpg",
      alt: "",
      body: ["¡Seguimos sumando recursos! Llegaron 10 nuevos recursos a nuestra colección. Te invitamos a visitar nuestro banco para que explores estas alternativas y enriquezcas tus experiencias de aprendizaje."],
    },
    {
      id: "experiencia-1", type: "Experiencia",
      title: "Hellen Zamudio: crear recursos educativos dentro del proceso DEDA",
      image: "experiencia-hellen-zamudio.webp",
      alt: "Profesores reunidos alrededor de una mesa de trabajo mientras se proyecta la Guía de Recursos Educativos.",
      body: ["La profesora Hellen Zamudio, del Departamento de Diseño, nos cuenta cómo ha sido su experiencia creando recursos educativos dentro del proceso DEDA."],
    },
    {
      id: "experiencia-2", type: "Experiencia",
      title: "El RED en el aula: la experiencia del profesor Jairo Castillo",
      image: "experiencia-jairo-castillo.webp",
      alt: "Un profesor explica un recurso educativo digital proyectado en pantalla ante un grupo de colegas.",
      body: ["El profesor Jairo Castillo, de la Facultad de Ingenierías, nos comparte su experiencia haciendo uso del recurso educativo digital “Conoce los sistemas neumáticos y oleohidráulicos” en una de sus clases."],
    },
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
        <img class="x-article__image" src="assets/img/${a.image}" width="960" height="540" alt="${esc(a.alt)}">
        <div class="x-prose t-body-lead">${a.body.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      </article>
      <section class="page__section" aria-labelledby="mas-t">
        ${R.sectionTitle(news ? "Más noticias" : "Más experiencias", { id: "mas-t", color: news ? "orange" : "cyan", shape: news ? "bl" : "tl" })}
        <ul class="card-list x-related">${more.map((x) => `<li><a class="card-news" href="articulo.html?t=${x.id}">
          <img class="card-news__image" src="assets/img/${x.image}" width="960" height="540" loading="lazy" alt="">
          <div class="card-news__row"><h3 class="card-news__title t-body-card-title">${esc(x.title)}</h3>${ARROW}</div></a></li>`).join("")}</ul>
      </section>`);
  }

  ({ colecciones: initCollections, autores: initAuthors, "que-es": initAbout, articulo: initArticle })[page]?.();
})();
