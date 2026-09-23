// i18n de la web. ES es el idioma por defecto (rutas en la raíz); IT vive bajo /it/.
export type Locale = "es" | "it";
export const locales: Locale[] = ["es", "it"];
export const defaultLocale: Locale = "es";

// URL del sitio en inglés (aún en el WordPress original).
export const enHref = "https://www.lanegrasalsa.com/en/la-negra-salsa";

/** Detecta el idioma a partir de la URL. */
export function getLocale(url: URL): Locale {
  return url.pathname === "/it" || url.pathname.startsWith("/it/") ? "it" : "es";
}

/** Convierte una ruta canónica (en ES, p.ej. "/evelyn-la-negra/") a su versión localizada. */
export function localize(path: string, locale: Locale): string {
  if (locale === "es") return path;
  if (path === "/") return "/it/";
  return "/it" + path;
}

/** Ruta canónica (sin el prefijo /it) de la URL actual. */
export function canonicalPath(url: URL): string {
  const p = url.pathname.replace(/^\/it(?=\/|$)/, "");
  return p === "" ? "/" : p;
}

/** Devuelve las URLs equivalentes en cada idioma para el selector. */
export function altUrls(url: URL) {
  const base = canonicalPath(url);
  return {
    es: base,
    it: base === "/" ? "/it/" : "/it" + base,
    en: enHref,
  };
}

export const langNames: Record<string, string> = {
  es: "Español",
  it: "Italiano",
  en: "English",
};

// ===== Diccionario de la cáscara (chrome) =====
export const ui = {
  es: {
    htmlLang: "es",
    ogLocale: "es_ES",
    tagline: "Salsa y bachata dominicana, desde la raíz",
    credit: "Diseño y desarrollo a partir del sitio original",
    nav: [
      { href: "/bachata-dominicana/", label: "Bachata dominicana" },
      { href: "/evelyn-la-negra/", label: "Sobre Evelyn" },
      { href: "/clases-presenciales/", label: "Clases presenciales" },
      { href: "/curso-online-bachata-dominicana/", label: "Curso online" },
      { href: "/profesora-bachata-dominicana/", label: "Máster bachata tradicional" },
      { href: "/blog/", label: "Blog" },
      { href: "/logotipos/", label: "Logotipos" },
      { href: "/spotify/", label: "Spotify" },
    ],
    footer: {
      followMe: "Sígueme",
      cols: [
        {
          title: "",
          links: [
            { label: "Home", href: "/" },
            { label: "Bachata dominicana", href: "/bachata-dominicana/" },
            { label: "Sobre Evelyn", href: "/evelyn-la-negra/" },
            { label: "Blog", href: "/blog/" },
            { label: "FOTOS Keeper", href: "/keeper-galeria/" },
            { label: "Spotify", href: "/spotify/" },
            { label: "Logotipos", href: "/logotipos/" },
          ],
        },
        {
          title: "Clases",
          links: [
            { label: "Clases presenciales", href: "/clases-presenciales/" },
            { label: "Curso online", href: "/curso-online-bachata-dominicana/" },
            { label: "Máster bachata tradicional", href: "/profesora-bachata-dominicana/" },
          ],
        },
        {
          title: "Eventos",
          links: [
            { label: "LaNegra World Championship", href: "__festival__", external: true },
            { label: "Keeper eventos 2025", href: "/keeper-galeria-eventos-2025/" },
            { label: "Keeper eventos 2026", href: "/keeper-galeria-eventos-2026/" },
          ],
        },
      ],
      contactTitle: "Contacto",
      sitesTitle: "Nuestras webs",
      legal: [
        { label: "Aviso legal", href: "/aviso-legal/" },
        { label: "Privacidad", href: "/privacidad/" },
        { label: "Cookies", href: "/cookies/" },
      ],
    },
    areaPrivada: "Área privada",
    waitlist: {
      kicker: "Lista de espera",
      title: "Avísame cuando abra el curso",
      note: "Estoy preparando el curso online de bachata tradicional. Déjame tus datos y serás de las primeras personas en saber cuándo abre, con el programa y las condiciones.",
      cta: "Avísame",
      promise: "Sin spam: te escribo solo para contarte que el curso ya está disponible.",
      nombre: "Nombre",
      apellidos: "Apellidos",
      artistico: "Nombre artístico",
      artisticoHint: "si tienes",
      instagram: "Instagram",
      email: "Correo electrónico",
      telefono: "Teléfono (WhatsApp)",
      telefonoHint: "Imprescindible: las clases van por WhatsApp",
      ciudad: "Ciudad",
      pais: "País",
      disciplinas: "Profesor o bailarín de",
      otras: "Otras disciplinas",
      experiencia: "Años de experiencia profesional",
      comoConociste: "¿Cómo te enteraste de este curso?",
      expectativas: "¿Qué esperas recibir de esta formación?",
    },
    form: {
      nombre: "Nombre",
      email: "Email",
      telefono: "Teléfono",
      mensaje: "Mensaje",
      enviar: "Enviar",
      consent: 'He leído y acepto la',
      consentLink: "política de privacidad",
      noFill: "No rellenar",
    },
    wa: "¡Hola Evelyn! Quiero información sobre las clases.",
    waLabel: "Escríbeme por WhatsApp",
  },
  it: {
    htmlLang: "it",
    ogLocale: "it_IT",
    tagline: "Salsa e bachata dominicana, dalla radice",
    credit: "Design e sviluppo a partire dal sito originale",
    nav: [
      { href: "/evelyn-la-negra/", label: "Chi è Evelyn" },
      { href: "/clases-presenciales/", label: "Lezioni in presenza" },
      { href: "/curso-online-bachata-dominicana/", label: "Corso online" },
      { href: "/profesora-bachata-dominicana/", label: "Master bachata tradizionale" },
      { href: "/logotipos/", label: "Loghi" },
      { href: "/spotify/", label: "Spotify" },
    ],
    footer: {
      followMe: "Seguimi",
      cols: [
        {
          title: "",
          links: [
            { label: "Home", href: "/" },
            { label: "Chi è Evelyn", href: "/evelyn-la-negra/" },
            { label: "Foto Keeper", href: "/keeper-galeria/" },
            { label: "Spotify", href: "/spotify/" },
            { label: "Loghi", href: "/logotipos/" },
          ],
        },
        {
          title: "Lezioni",
          links: [
            { label: "Lezioni in presenza", href: "/clases-presenciales/" },
            { label: "Corso online", href: "/curso-online-bachata-dominicana/" },
            { label: "Master bachata tradizionale", href: "/profesora-bachata-dominicana/" },
          ],
        },
        {
          title: "Eventi",
          links: [
            { label: "LaNegra World Championship", href: "__festival__", external: true },
            { label: "Keeper eventi 2025", href: "/keeper-galeria-eventos-2025/" },
            { label: "Keeper eventi 2026", href: "/keeper-galeria-eventos-2026/" },
          ],
        },
      ],
      contactTitle: "Contatti",
      sitesTitle: "I nostri siti",
      legal: [
        { label: "Note legali", href: "/aviso-legal/" },
        { label: "Privacy", href: "/privacidad/" },
        { label: "Cookie", href: "/cookies/" },
      ],
    },
    areaPrivada: "Area riservata",
    waitlist: {
      kicker: "Lista d’attesa",
      title: "Avvisami quando apre il corso",
      note: "Sto preparando il corso online di bachata tradizionale. Lasciami i tuoi dati e sarai tra i primi a sapere quando apre, con il programma e le condizioni.",
      cta: "Avvisami",
      promise: "Niente spam: ti scrivo solo per dirti che il corso è disponibile.",
      nombre: "Nome",
      apellidos: "Cognome",
      artistico: "Nome d’arte",
      artisticoHint: "se ne hai uno",
      instagram: "Instagram",
      email: "Email",
      telefono: "Telefono (WhatsApp)",
      telefonoHint: "Indispensabile: le lezioni passano da WhatsApp",
      ciudad: "Città",
      pais: "Paese",
      disciplinas: "Insegnante o ballerino di",
      otras: "Altre discipline",
      experiencia: "Anni di esperienza professionale",
      comoConociste: "Come hai saputo di questo corso?",
      expectativas: "Cosa ti aspetti da questa formazione?",
    },
    form: {
      nombre: "Nome",
      email: "Email",
      telefono: "Telefono",
      mensaje: "Messaggio",
      enviar: "Invia",
      consent: "Ho letto e accetto l’",
      consentLink: "informativa sulla privacy",
      noFill: "Non compilare",
    },
    wa: "Ciao Evelyn! Vorrei informazioni sulle lezioni.",
    waLabel: "Scrivimi su WhatsApp",
  },
} as const;
