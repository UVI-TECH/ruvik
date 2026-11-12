/* ==========================================================================
   RUVIK · Detalle del recurso (recurso.html?id=…)
   Comentarios y experiencias: solo interfaz, aún no hay backend.
   ========================================================================== */

(() => {
  "use strict";

  const R = window.RUVIK;
  const main = document.getElementById("contenido");
  const r = R?.getResource(R.param("id"));
  if (!r) {
    if (R && main) R.notFound(main);
    return;
  }

  const { esc } = R;
  document.title = `${r.title} · RUVIK`;

  const ai = r.ai.note ? `${r.ai.level}: ${r.ai.note}` : r.ai.level;
  const sheet = R.sheet([
    ["Tipo de recurso", r.type],
    ["Formato", r.format],
    ["Duración", r.duration],
    ["Año de producción", String(r.year)],
    ["Facultad", r.faculty],
    ["Programa", r.program],
    ["Asignatura", r.subject],
    ["Proyecto", r.project],
    [r.advisor.role, r.advisor.name],
    ["Uso de IA", ai],
  ]);

  const tags = r.tags.length
    ? `<ul class="tags" aria-label="Etiquetas">${r.tags
        .map((t) => `<li><a class="tag" href="${R.searchUrl(t)}">#${esc(t)}</a></li>`)
        .join("")}</ul>`
    : "";

  const author = r.author
    ? `
      <section class="panel" aria-labelledby="autor-title">
        <h2 class="t-heading-section" id="autor-title">${esc(r.author.cardTitle)}</h2>
        <div class="author">
          <span class="author__avatar" aria-hidden="true"></span>
          <div>
            <p class="author__name">${esc(r.author.name)}</p>
            <p class="author__faculty t-body-caption">${esc(r.author.faculty)}</p>
          </div>
        </div>
        <p class="panel__text t-body-small">${esc(r.author.bio)}</p>
        <a class="btn-outline t-label-button" href="${R.searchUrl(r.author.name)}">Ver más recursos del autor</a>
      </section>`
    : `
      <section class="panel" aria-labelledby="autor-title">
        <h2 class="t-heading-section" id="autor-title">Profe creador o creadora</h2>
        <div class="author">
          <span class="author__avatar" aria-hidden="true"></span>
          <div>
            <p class="author__name">Información por confirmar</p>
            <p class="author__faculty t-body-caption">Aún no hay biografía registrada</p>
          </div>
        </div>
      </section>`;

  const related = R.resources.filter((x) => x.id !== r.id);
  const shareMail = `mailto:recursosruvik@uniajc.edu.co?subject=${encodeURIComponent(`Experiencia de uso: ${r.title}`)}`;

  main.innerHTML = `
    <div class="container page">
      <div>
        <a class="btn-outline t-label-button" href="${esc(R.lastSearch())}">Volver a resultados</a>
      </div>

      <article class="resource-hero" aria-labelledby="recurso-title">
        ${R.mosaic(r, { className: "resource-hero__image" })}
        <div class="resource-hero__body">
          <p class="resource-hero__meta t-body-caption">${esc(R.typeLine(r))}</p>
          <h1 class="t-display-h2" id="recurso-title">${esc(r.title)}</h1>
          <h2 class="resource-hero__eyebrow t-heading-eyebrow">Sinopsis del recurso</h2>
          <p class="resource-hero__synopsis t-body-lead">${esc(r.synopsis)}</p>
          <div class="resource-hero__actions">
            <a class="btn-cta btn-cta--on-light t-label-cta" href="${R.viewerUrl(r)}">Ver recurso</a>
            <a class="btn-outline btn-outline--lg t-label-button" href="#como-usar">¿Cómo usar este recurso?</a>
          </div>
          ${tags}
        </div>
      </article>

      <div class="info-grid">
        <section class="panel" aria-labelledby="objetivo-title">
          <h2 class="t-heading-section" id="objetivo-title">Objetivo pedagógico</h2>
          <p class="panel__text t-body-small">${esc(r.objective)}</p>
        </section>
        <section class="panel" id="como-usar" tabindex="-1" aria-labelledby="uso-title">
          <h2 class="t-heading-section" id="uso-title">Cómo se puede usar este recurso</h2>
          <p class="panel__text t-body-small">${esc(r.usage)}</p>
        </section>
      </div>

      <div class="info-grid">
        <section class="panel" aria-labelledby="ficha-title">
          <h2 class="t-heading-section" id="ficha-title">Ficha técnica</h2>
          ${sheet}
        </section>
        ${author}
      </div>

      <section class="page__section" aria-labelledby="experiencias-title">
        ${R.sectionTitle("Experiencias de uso", { id: "experiencias-title" })}
        <div class="panel empty-panel">
          <h3 class="empty-panel__title">Todavía no hay experiencias compartidas</h3>
          <p class="panel__text t-body-small">¿Usaste este recurso en tu clase? Cuéntanos cómo lo aplicaste y qué resultados tuviste. Tu experiencia puede servirle a otros profesores.</p>
          <a class="btn-outline t-label-button" href="${esc(shareMail)}">Compartir mi experiencia</a>
        </div>
      </section>

      <section class="page__section" aria-labelledby="comentarios-title">
        ${R.sectionTitle("Comentarios", { id: "comentarios-title" })}
        <form class="comment-form" novalidate>
          <label class="comment-form__label" for="comentario">Tu comentario</label>
          <textarea class="comment-form__input" id="comentario" name="comentario" rows="3"
                    placeholder="Escribe aquí tu pregunta, aporte o sugerencia sobre este recurso"></textarea>
          <button class="btn-cta btn-cta--on-light t-label-cta" type="submit">Publicar comentario</button>
          <p class="comment-form__status t-body-small" aria-live="polite">Aún no hay comentarios. Sé la primera persona en comentar este recurso.</p>
        </form>
      </section>

      ${
        related.length
          ? `<section class="page__section" aria-labelledby="relacionados-title">
              ${R.sectionTitle("Recursos relacionados", { id: "relacionados-title" })}
              <ul class="resource-grid">${related.map((x) => R.card(x)).join("")}</ul>
            </section>`
          : ""
      }
    </div>`;

  /* "¿Cómo usar este recurso?" lleva el foco a la tarjeta */
  main.querySelector('a[href="#como-usar"]').addEventListener("click", () => {
    requestAnimationFrame(() => document.getElementById("como-usar").focus({ preventScroll: true }));
  });

  /* Comentarios: sin backend todavía */
  const form = main.querySelector(".comment-form");
  const field = form.querySelector(".comment-form__input");
  const status = form.querySelector(".comment-form__status");
  const EMPTY = status.textContent;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const empty = !field.value.trim();
    status.classList.toggle("is-error", empty);
    status.textContent = empty
      ? "Escribe un comentario antes de publicar."
      : "La publicación de comentarios estará disponible pronto. Tu texto no se ha enviado.";
    if (empty) field.focus();
  });

  field.addEventListener("input", () => {
    if (status.classList.contains("is-error")) {
      status.classList.remove("is-error");
      status.textContent = EMPTY;
    }
  });
})();
