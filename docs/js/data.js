/* ==========================================================================
   RUVIK · Catálogo de ejemplo
   Contenido tomado de Figma (Recurso 1–3 y Visualizador 1–3). Cuando exista la
   plataforma, este archivo se reemplaza por la respuesta de la API con la misma
   forma de datos.

   mosaic: 9 colores (fila por fila) de la "Imagen del recurso". Las formas son
   fijas (ver SHAPES en render.js); solo cambian los colores. Las tarjetas usan
   la primera fila.
   facets: valores para los filtros de la búsqueda avanzada.
   POR CONFIRMAR: red, coleccion, acceso y published son valores de ejemplo
   para poder probar filtros y orden; Figma no los define.
   ========================================================================== */

window.RUVIK = window.RUVIK || {};

window.RUVIK.filters = [
  {
    key: "red",
    label: "Tipo de RED",
    options: [
      ["activacion", "Activación"],
      ["apoyo", "Apoyo"],
      ["profundizacion", "Profundización"],
      ["aplicacion", "Aplicación"],
      ["evaluacion", "Evaluación"],
    ],
  },
  {
    key: "facultad",
    label: "Facultad",
    options: [
      ["ingenieria", "Ingeniería"],
      ["ciencias-sociales", "Ciencias sociales"],
      ["educacion", "Educación"],
      ["administracion", "Administración"],
    ],
  },
  {
    key: "formato",
    label: "Formato",
    // "Imagen interactiva" no está en Figma, pero es el tipo de 2 de los 3 recursos
    options: [
      ["imagen-interactiva", "Imagen interactiva"],
      ["video", "Video"],
      ["pdf-interactivo", "PDF interactivo"],
      ["infografia", "Infografía"],
      ["podcast", "Podcast"],
    ],
  },
  {
    key: "coleccion",
    label: "Colección",
    options: [
      ["coleccion-1", "Colección 1"],
      ["coleccion-2", "Colección 2"],
    ],
  },
  {
    key: "acceso",
    label: "Acceso",
    options: [
      ["abierto", "Abierto"],
      ["solo-uniajc", "Solo UNIAJC"],
    ],
  },
];

window.RUVIK.resources = [
  {
    id: "entorno-adobe-illustrator",
    title: "¡Exploremos el entorno de Adobe Illustrator!",
    type: "Imagen interactiva",
    format: "Genially",
    platform: "Genially",
    duration: "No aplica",
    year: 2026,
    published: "2026-10-30",
    faculty: "Ciencias Sociales y Humanas",
    program: "Diseño Visual",
    subject: "Medios II",
    project: "Proceso DEDA",
    advisor: { role: "Asesora", name: "Laura Hurtado" },
    ai: { level: "Nivel 1", note: "sin uso de IA generativa" },
    url: "#",
    embedUrl: "",
    facets: {
      red: "activacion",
      facultad: "ciencias-sociales",
      formato: "imagen-interactiva",
      coleccion: "coleccion-1",
      acceso: "abierto",
    },
    mosaic: ["violet", "yellow", "cyan", "mint", "violet", "orange", "pink", "yellow", "blue"],
    synopsis:
      "Si es tu primera vez con Adobe Illustrator, este recurso te ayudará a reconocer su entorno de trabajo y a familiarizarte con sus principales herramientas y áreas, sin perderte. Está dirigido a estudiantes, profesores, profesoras y personas interesadas en el diseño que se acercan por primera vez a Adobe Illustrator.",
    tags: ["illustrator", "Medios II", "Diseño Visual", "Adobe"],
    objective:
      "Conocer e identificar los elementos que componen el entorno de trabajo y las herramientas básicas del software Adobe Illustrator, comprendiendo su función dentro del proceso de edición de gráficos vectoriales.",
    usage:
      "Se puede usar como una actividad de exploración guiada en un primer acercamiento a la interfaz de Adobe Illustrator. El profesor o profesora comparte el enlace y orienta a los estudiantes para que recorran la imagen interactiva y hagan clic en cada punto: barra de menús, barra de herramientas, panel de propiedades, panel de capas, mesas de trabajo y espacios de trabajo personalizados. Después, los estudiantes relacionan cada elemento con situaciones reales de edición de gráficos vectoriales y responden la evaluación incluida.",
    author: {
      name: "Hellen Zamudio",
      role: "Autora",
      cardTitle: "Profe creadora",
      faculty: "Ciencias Sociales y Humanas",
      bio: "Profesional en diseño gráfico y magíster en diseño y creación interactiva, con amplia experiencia en docencia universitaria en los programas de diseño visual, tecnología en transmedia, publicidad y artes visuales. Actualmente es docente de la asignatura Medios I en la Institución Universitaria Antonio José Camacho. Le apasiona el desarrollo de estrategias educativas innovadoras, las narrativas digitales y el diseño de recursos educativos.",
    },
    viewer: {
      kind: "concepts",
      intro: "Aquí se abre el recurso interactivo. Haz clic en cada punto para reconocer las partes de la interfaz.",
      concepts: [
        ["Barra de menús", "violet"],
        ["Barra de herramientas", "mint"],
        ["Paneles de propiedades", "cyan"],
        ["Panel de capas", "pink"],
        ["Mesa de trabajo", "yellow"],
        ["Espacios de trabajo personalizados", "blue"],
      ],
    },
    files: [
      { title: "Recurso interactivo en Genially", meta: "Enlace externo", action: "Abrir recurso", href: "#", external: true, icon: ["violet", ""] },
      { title: "Cómo usar y evaluar este recurso", meta: "PDF", action: "Descargar", href: "#", icon: ["cyan", "tl"] },
    ],
  },
  {
    id: "narrativas-que-conectan",
    title: "Narrativas que conectan",
    type: "Imagen interactiva",
    format: "Genially",
    platform: "Genially",
    duration: "No aplica",
    year: 2026,
    published: "2026-10-20",
    faculty: "Ciencias Sociales y Humanas",
    program: "Diseño Visual",
    subject: "Diseño de la Información",
    project: "Proceso DEDA",
    advisor: { role: "Asesora", name: "Laura Hurtado" },
    ai: { level: "Nivel 3", note: "" },
    url: "#",
    embedUrl: "",
    facets: {
      red: "profundizacion",
      facultad: "ciencias-sociales",
      formato: "imagen-interactiva",
      coleccion: "coleccion-1",
      acceso: "abierto",
    },
    mosaic: ["lilac", "pink", "mint", "violet", "yellow", "lilac", "cyan", "pink", "violet"],
    synopsis:
      "Narrativas que conectan es un recurso interactivo que te invita a descubrir cómo el diseño centrado en el usuario y las narrativas visuales potencian la comunicación digital a través de estrategias como el storytelling visual. A través de textos breves y contenidos visuales, podrás reconocer cómo estos elementos se articulan para comunicar información de manera clara, comprensible y atractiva.",
    tags: ["Diseño Visual", "Storytelling Visual", "Experiencia de Usuario", "Usabilidad", "Accesibilidad"],
    objective:
      "Reconocer y relacionar principios de diseño centrado en el usuario, usabilidad, accesibilidad y storytelling visual para comprender cómo estos elementos contribuyen a la creación de narrativas digitales claras, inclusivas y significativas.",
    usage:
      "Se utiliza como una actividad de exploración guiada: el profesor comparte el enlace de Genially, contextualiza brevemente el propósito del recurso y orienta a los estudiantes para que recorran la imagen interactiva. Al hacer clic en cada punto podrán reconocer cómo se relacionan los principios de diseño centrado en el usuario, usabilidad, accesibilidad, jerarquía visual, investigación de usuarios, narrativa secuencial, arco narrativo y data storytelling. Durante la navegación, se recomienda que los estudiantes relacionen cada concepto con ejemplos de interfaces, contenidos multimedia o visualización de datos.",
    author: null,
    viewer: {
      kind: "concepts",
      intro: "Haz clic en cada concepto para leer su explicación.",
      concepts: [
        ["Usuario como centro de la experiencia", "violet"],
        ["Usabilidad", "mint"],
        ["Accesibilidad", "cyan"],
        ["Jerarquía visual", "pink"],
        ["Investigación de usuarios", "yellow"],
        ["Narrativa secuencial", "blue"],
        ["Arco narrativo", "orange"],
        ["Data storytelling", "lilac"],
        ["Storytelling en entornos digitales", "red-orange"],
      ],
    },
    files: [
      { title: "Recurso interactivo en Genially", meta: "Enlace externo", action: "Abrir recurso", href: "#", external: true, icon: ["violet", ""] },
      { title: "Cómo usar y evaluar este recurso", meta: "PDF", action: "Descargar", href: "#", icon: ["cyan", "tl"] },
    ],
  },
  {
    id: "que-es-el-diseno-editorial",
    title: "¿Qué es el diseño editorial?",
    type: "Video",
    format: "Genially y YouTube",
    platform: "Genially",
    duration: "2:09",
    year: 2026,
    published: "2026-10-10",
    faculty: "Ciencias Sociales y Humanas",
    program: "Diseño Visual",
    subject: "Diseño Editorial",
    project: "Proceso DEDA",
    advisor: { role: "Asesora", name: "Laura Hurtado" },
    ai: { level: "Nivel 3", note: "" },
    url: "#",
    embedUrl: "",
    facets: {
      red: "apoyo",
      facultad: "ciencias-sociales",
      formato: "video",
      coleccion: "coleccion-2",
      acceso: "solo-uniajc",
    },
    mosaic: ["yellow", "blue", "orange", "cyan", "yellow", "pink", "orange", "blue", "yellow"],
    synopsis:
      "En este video podrás conocer de una manera breve y sencilla, qué es el diseño editorial, y por qué constituye una rama fundamental del diseño visual. También descubrirás cómo cumple un papel crucial a nivel social y cultural, mediando la relación entre los contenidos y los lectores.",
    tags: [],
    objective:
      "Reconocer los fundamentos del diseño editorial mediante la comprensión de sus elementos visuales, estructurales y comunicativos, para interpretar cómo la organización del contenido influye en la experiencia del usuario y en la comunicación efectiva de mensajes en publicaciones impresas y digitales.",
    usage:
      "Se utiliza como un video educativo de introducción y refuerzo conceptual: el profesor comparte el recurso en Genially, contextualiza brevemente el propósito de la actividad y orienta a los estudiantes para que observen la secuencia completa. Durante la visualización, se recomienda realizar pausas breves para comentar ejemplos de jerarquía visual, títulos, subtítulos, columnas, márgenes y retículas. Después, los estudiantes pueden analizar una pieza editorial sencilla y relacionar sus decisiones visuales con la experiencia del lector.",
    author: null,
    viewer: {
      kind: "video",
      intro: "Reproduce el video (2:09). Incluye subtítulos.",
    },
    files: [
      { title: "Video en Genially", meta: "Enlace externo", action: "Abrir recurso", href: "#", external: true, icon: ["violet", ""] },
      { title: "Cómo usar y evaluar este recurso", meta: "PDF", action: "Descargar", href: "#", icon: ["cyan", "tl"] },
    ],
  },
];
