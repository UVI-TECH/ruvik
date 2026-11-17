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
    if (!r.url && !v.concepts.length && v.kind !== "video") {
      return `<div class="viewer-card"><p class="viewer-card__eyebrow t-heading-eyebrow">${esc(r.platform)}</p><h2 class="t-heading-collection">${esc(r.title)}</h2><p class="viewer-card__text t-body-default">El enlace de este recurso está por confirmar.</p></div>`;
    }
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

  const isPdf = (f) => /\.pdf($|#|\?)/i.test(f.href || "");
  const actions = (f) =>
    isPdf(f)
      ? `<div class="file-card__actions">
           <button class="btn-outline btn-outline--block t-label-button" type="button" data-pdf="${esc(f.href)}" data-pdf-title="${esc(f.title)}" aria-haspopup="dialog">Vista previa</button>
           <a class="btn-outline btn-outline--block t-label-button" href="${esc(f.href)}" download>${esc(f.action)}</a>
         </div>`
      : `<a class="btn-outline btn-outline--block t-label-button" href="${esc(f.href)}"${f.external ? external(f.href) : f.href !== "#" ? " download" : ""}>${esc(f.action)}</a>`;

  const files = r.files.length
    ? r.files
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
        ${actions(f)}
      </li>`
    )
    .join("")
    : `<li class="file-card"><p class="t-body-small">Este recurso aún no tiene archivos descargables.</p></li>`;

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
            ${r.url ? `<a class="btn-outline t-label-button" href="${esc(r.url)}"${external(r.url)}>Abrir en ${esc(r.platform)}</a>` : ""}
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
  /* ---------- Vista previa de PDF ----------
     Modal con el PDF incrustado; Esc, clic fuera y foco atrapado como en la búsqueda. */
  const dlg = document.createElement("div");
  dlg.className = "pdf-modal";
  dlg.hidden = true;
  dlg.innerHTML = `
    <div class="pdf-modal__backdrop" data-pdf-close></div>
    <div class="pdf-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="pdf-title">
      <div class="pdf-modal__top">
        <h2 class="t-heading-section" id="pdf-title"></h2>
        <button class="btn-outline t-label-button" type="button" data-pdf-close>Cerrar</button>
      </div>
      <iframe class="pdf-modal__frame" title="Vista previa del PDF"></iframe>
      <div class="pdf-modal__bottom">
        <p class="t-body-small">¿No se ve el documento? Descárgalo para abrirlo en tu equipo.</p>
        <a class="btn-cta btn-cta--on-light t-label-cta" href="#" download>Descargar PDF</a>
      </div>
    </div>`;
  document.body.appendChild(dlg);
  const frame = dlg.querySelector("iframe");
  const closeBtn = dlg.querySelector(".pdf-modal__top button");
  let opener = null;

  const FOCUSABLE = 'a[href], button:not([disabled])';
  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); closePdf(); return; }
    if (e.key !== "Tab") return;
    const items = [...dlg.querySelectorAll(FOCUSABLE)];
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openPdf(btn) {
    opener = btn;
    dlg.querySelector("#pdf-title").textContent = btn.dataset.pdfTitle;
    frame.src = btn.dataset.pdf + "#toolbar=0&navpanes=0";
    const a = dlg.querySelector(".pdf-modal__bottom a");
    a.href = btn.dataset.pdf;
    dlg.hidden = false;
    document.body.classList.add("is-locked");
    document.addEventListener("keydown", onKey);
    closeBtn.focus();
  }
  function closePdf() {
    if (dlg.hidden) return;
    dlg.hidden = true;
    frame.src = "about:blank";
    document.body.classList.remove("is-locked");
    document.removeEventListener("keydown", onKey);
    opener?.focus();
  }
  main.querySelectorAll("[data-pdf]").forEach((b) => b.addEventListener("click", () => openPdf(b)));
  dlg.querySelectorAll("[data-pdf-close]").forEach((el) => el.addEventListener("click", closePdf));
})();
