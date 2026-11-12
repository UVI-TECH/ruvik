/* ==========================================================================
   RUVIK · Búsqueda avanzada
   Filtra el catálogo en el navegador. El estado (q, filtros y orden) vive en
   la URL, así que un enlace o "Volver a resultados" recupera la misma búsqueda.
   - Texto: todas las palabras deben aparecer (sin tildes ni mayúsculas).
   - Filtros: O dentro de un grupo, Y entre grupos.
   ========================================================================== */

(() => {
  "use strict";

  const R = window.RUVIK;
  if (!R?.resources) return;

  const searchForm = document.getElementById("advanced-search");
  const input = document.getElementById("q");
  const filtersForm = document.getElementById("filters-body");
  const filtersBox = document.querySelector(".filters");
  const toggle = document.querySelector(".filters__toggle");
  const badge = document.querySelector(".filters__count");
  const sort = document.getElementById("sort");
  const count = document.getElementById("results-count");
  const list = document.getElementById("results-list");
  const empty = document.getElementById("results-empty");

  /* ---------- Filtros desde data.js ---------- */
  const groups = R.filters
    .map(
      (group) => `
      <fieldset class="filter-group">
        <legend class="filter-group__legend">${R.esc(group.label)}</legend>
        ${group.options
          .map(
            ([value, label]) => `
          <label class="check t-body-small">
            <input class="check__input" type="checkbox" name="${group.key}" value="${value}">
            <span>${R.esc(label)}</span>
          </label>`
          )
          .join("")}
      </fieldset>`
    )
    .join("");
  filtersForm.querySelector('[type="reset"]').insertAdjacentHTML("beforebegin", groups);

  /* Texto indexado de cada recurso */
  const index = new Map(
    R.resources.map((r) => [
      r.id,
      R.normalize(
        [r.title, r.type, r.format, r.faculty, r.program, r.subject, r.project, r.synopsis, r.objective, r.author?.name, ...r.tags].join(" ")
      ),
    ])
  );

  /* ---------- Estado ↔ URL ---------- */
  function readUrl() {
    const params = new URLSearchParams(location.search);
    input.value = params.get("q") || "";
    const sortValue = params.get("orden");
    if ([...sort.options].some((o) => o.value === sortValue)) sort.value = sortValue;
    R.filters.forEach(({ key }) => {
      const selected = (params.get(key) || "").split(",");
      filtersForm.querySelectorAll(`[name="${key}"]`).forEach((box) => {
        box.checked = selected.includes(box.value);
      });
    });
  }

  function state() {
    const filters = {};
    R.filters.forEach(({ key }) => {
      const values = [...filtersForm.querySelectorAll(`[name="${key}"]:checked`)].map((b) => b.value);
      if (values.length) filters[key] = values;
    });
    return { q: input.value.trim(), filters, sort: sort.value };
  }

  function writeUrl({ q, filters, sort: order }) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    Object.entries(filters).forEach(([key, values]) => params.set(key, values.join(",")));
    if (order !== "recent") params.set("orden", order);
    const query = params.toString();
    const url = `busqueda.html${query ? `?${query}` : ""}`;
    history.replaceState(null, "", url);
    R.saveLastSearch(url);
  }

  /* ---------- Búsqueda ---------- */
  const SORTS = {
    recent: (a, b) => b.published.localeCompare(a.published),
    az: (a, b) => a.title.replace(/^[¡¿]/, "").localeCompare(b.title.replace(/^[¡¿]/, ""), "es"),
    za: (a, b) => SORTS.az(b, a),
  };

  function run() {
    const current = state();
    const terms = R.normalize(current.q).split(/\s+/).filter(Boolean);

    const results = R.resources
      .filter((r) => terms.every((t) => index.get(r.id).includes(t)))
      .filter((r) => Object.entries(current.filters).every(([key, values]) => values.includes(r.facets[key])))
      .sort(SORTS[current.sort]);

    const n = results.length;
    count.textContent = `${n} ${n === 1 ? "recurso encontrado" : "recursos encontrados"}`;
    list.innerHTML = results.map((r) => R.card(r)).join("");
    list.hidden = n === 0;
    empty.hidden = n !== 0;

    const active = Object.values(current.filters).flat().length;
    badge.textContent = active ? `(${active})` : "";

    writeUrl(current);
  }

  /* ---------- Eventos ---------- */
  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(run, 200);
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timer);
    run();
  });

  filtersForm.addEventListener("change", run);
  sort.addEventListener("change", run);

  // El navegador desmarca las casillas después del evento "reset"
  filtersForm.addEventListener("reset", () => setTimeout(run));

  document.querySelector("[data-clear-all]")?.addEventListener("click", () => {
    input.value = "";
    filtersForm.reset();
    setTimeout(() => {
      run();
      input.focus();
    });
  });

  // Móvil: filtros plegables
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    filtersBox.classList.toggle("is-open", open);
  });

  readUrl();
  run();
})();
