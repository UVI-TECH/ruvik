# RUVIK

Sitio de RUVIK (UNIAJC Virtual) en HTML, CSS y JS sin dependencias, publicado con GitHub Pages desde `docs/`.

## Páginas

| Archivo | Pantalla de Figma |
|---|---|
| `index.html` | Home |
| `busqueda.html?q=…` | Búsqueda avanzada (filtros y orden en la URL) |
| `recurso.html?id=…` | Recurso 1–3 (detalle) |
| `visor.html?id=…` | Visualizador (Genially embebido) |
| `colecciones.html?c=…` | Colecciones (lista y detalle, ejemplo) |
| `autores.html?a=…` | Autores (lista y perfil) |
| `que-es.html` | ¿Qué es RUVIK? |
| `articulo.html?t=…` | Detalle de noticia o experiencia (contenido de ejemplo) |

Header, footer, menú y modal de búsqueda están copiados en cada página (no hay build);
cualquier cambio en ellos debe replicarse en todos los HTML.

## Estructura

```
docs/
├── index.html · busqueda.html · recurso.html · visor.html
├── css/
│   ├── tokens.css      # variables de diseño (Figma → Fundamentos)
│   ├── base.css        # reset, clases tipográficas, utilidades
│   ├── components.css  # componentes (Figma → Componentes)
│   ├── layout.css      # header, footer, secciones de la Home y responsive
│   ├── pages.css       # búsqueda avanzada, recurso y visor
│   └── extras.css      # colecciones, autores, qué es y artículo (prefijo x-)
├── js/
│   ├── data.js         # catálogo de recursos y filtros (reemplazar por la API)
│   ├── render.js       # helpers: mosaico, tarjeta, ficha técnica, escape
│   ├── main.js         # menú, modal de búsqueda, carrusel, FAQ, contenido sorpresa
│   ├── busqueda.js · recurso.js · visor.js
│   ├── extras.js       # colecciones, autores, qué es y artículo
└── assets/{icons,img,logos,pdf}
```

## Desarrollo local

```sh
cd docs && python3 -m http.server 8000
```

## Publicación

GitHub → Settings → Pages → *Deploy from a branch* → `main` / `/docs`.

## Imagen del recurso

Es el mosaico 3×3 de Figma hecho con `.mosaic` + `.cell`: las formas son fijas y cada
recurso define solo sus 9 colores (`mosaic` en `js/data.js`). Las tarjetas usan la primera fila.

## Recursos cargados

`js/data.js` trae 9 recursos de la ficha RUVIK (ids 1 a 10 del Excel; el 5 está vacío), con su
enlace de Genially en `url` y `embedUrl`. Los PDF de "Cómo usar y evaluar" (`assets/pdf/`) existen
solo para los 3 primeros. Tipo de RED, colección, acceso y fecha de publicación son de ejemplo.

## Pendiente de contenido

- Home: diapositivas 2–4 del hero, respuestas de FAQ, noticias, experiencias, colecciones y autores del "Contenido sorpresa".
- Recursos: enlaces reales (`url`, `embedUrl` para incrustar en el visor, `href` de archivos) y
  los valores de Tipo de RED, Colección, Acceso y fecha de publicación (hoy son de ejemplo).
- Comentarios y experiencias de uso: solo interfaz; "Compartir mi experiencia" abre un correo.
