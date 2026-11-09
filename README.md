# RUVIK

Home de RUVIK (UNIAJC Virtual) en HTML, CSS y JS sin dependencias, publicada con GitHub Pages desde `docs/`.

## Estructura

```
docs/
├── index.html
├── css/
│   ├── tokens.css      # variables de diseño (Figma → Fundamentos)
│   ├── base.css        # reset, clases tipográficas, utilidades
│   ├── components.css  # componentes (Figma → Componentes)
│   └── layout.css      # secciones de la Home y responsive
├── js/main.js          # carrusel, acordeón FAQ, menú lateral, contenido sorpresa
└── assets/{icons,logos}
```

## Desarrollo local

```sh
cd docs && python3 -m http.server 8000
```

## Publicación

GitHub → Settings → Pages → *Deploy from a branch* → `main` / `/docs`.

## Pendiente de contenido

Diapositivas 2–4 del hero, respuestas de FAQ, noticias, experiencias, colecciones,
destinos de búsqueda y datos reales del "Contenido sorpresa" (`SURPRISE` en `js/main.js`).
