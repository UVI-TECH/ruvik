/* ==========================================================================
   RUVIK · Visor del recurso (visor.html?id=…)
   Si el recurso tiene embedUrl se incrusta en un iframe; si no, se muestra la
   vista previa de Figma (conceptos o video).
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
  document.title = `${r.title} · Visor · RUVIK`;

  const external = (href) => (href && href !== "#" ? ` target="_blank" rel="noopener"` : "");

  function preview() {
    if (r.embedUrl) {
      return `<iframe class="viewer-stage__frame" src="${esc(r.embedUrl)}" title="${esc(r.title)}" allowfullscreen loading="lazy"></iframe>`;
    }
    const v = r.viewer;
    const body =
      v.kind === "video"
        ? `<a class="video-placeholder" href="${esc(r.url)}"${external(r.url)}>
             <span class="video-placeholder__play" aria-hidden="true"></span>
             <span class="t-body-small">Reproducir video, ${esc(r.duration)}</span>
           </a>`
        : `<ul class="chips" aria-label="Conceptos del recurso">${v.concepts
            .map(([label, color]) => `<li class="chip t-body-small c-${esc(color)}"><span class="chip__dot" aria-hidden="true"></span>${esc(label)}</li>`)
            .join("")}</ul>`;
    return `
      <div class="viewer-card">
        <p class="viewer-card__eyebrow t-heading-eyebrow">${esc(r.platform)}</p>
        <h2 class="t-heading-collection">${esc(r.title)}</h2>
        <p class="viewer-card__text t-body-default">${esc(v.intro)}</p>
        ${body}
      </div>`;
  }

  const files = r.files
    .map(
      (f) => `
      <li class="file-card">
        <div class="file-card__head">
          <span class="file-card__icon">${R.cell(f.icon[0], f.icon[1])}</span>
          <div>
            <h3 class="file-card__title">${esc(f.title)}</h3>
            <p class="file-card__meta t-body-small">${esc(f.meta)}</p>
          </div>
        </div>
        <a class="btn-outline btn-outline--block t-label-button" href="${esc(f.href)}"${f.external ? external(f.href) : f.href !== "#" ? " download" : ""}>${esc(f.action)}</a>
      </li>`
    )
    .join("");

  const sheet = R.sheet(
    [
      ["Tipo de recurso", r.type],
      r.author ? [r.author.role, r.author.name] : ["Autoría", "Sin registrar"],
      ["Facultad", r.faculty],
      ["Programa", r.program],
      ["Asignatura", r.subject],
      ["Año", String(r.year)],
      ["Uso de IA", r.ai.level],
    ],
    "sheet--plain"
  );

  main.innerHTML = `
    <div class="container page page--tight">
      <div class="viewer-head">
        <a class="btn-outline btn-outline--lg t-label-button" href="${R.resourceUrl(r)}">Volver al recurso</a>
        <h1 class="viewer-head__title t-heading-collection">${esc(r.title)}</h1>
      </div>

      <div class="viewer-layout">
        <div class="viewer-main">
          <div class="viewer-toolbar">
            <span class="badge">${esc(r.type)}</span>
            <a class="btn-outline t-label-button" href="${esc(r.url)}"${external(r.url)}>Abrir en ${esc(r.platform)}</a>
            <button class="btn-outline t-label-button" type="button" data-fullscreen>Pantalla completa</button>
          </div>
          <div class="viewer-stage" id="vista-previa" role="region" aria-label="Vista previa del recurso">
            ${preview()}
          </div>
        </div>

        <aside class="viewer-aside" aria-label="Información del recurso">
          <section class="panel" aria-labelledby="archivos-title">
            <h2 class="t-heading-section" id="archivos-title">Archivos y documentos</h2>
            <ul class="files">${files}</ul>
          </section>
          <section class="panel" aria-labelledby="ficha-title">
            <h2 class="t-heading-section" id="ficha-title">Ficha técnica</h2>
            ${sheet}
          </section>
        </aside>
      </div>
    </div>`;

  /* Pantalla completa sobre el área de vista previa */
  const stage = document.getElementById("vista-previa");
  const fullscreen = main.querySelector("[data-fullscreen]");
  if (!stage.requestFullscreen) {
    fullscreen.hidden = true;
  } else {
    fullscreen.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else stage.requestFullscreen().catch(() => {});
    });
    document.addEventListener("fullscreenchange", () => {
      fullscreen.textContent = document.fullscreenElement ? "Salir de pantalla completa" : "Pantalla completa";
    });
  }
})();
