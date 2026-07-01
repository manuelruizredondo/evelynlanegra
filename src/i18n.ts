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

/** Convierte una ruta canónica (en ES, p.ej. "/curriculum/") a su versión localizada. */
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
    tagline: "La MEJOR profesora y DJ de RITMOS LATINOS",
    credit: "Diseño y desarrollo a partir del sitio original",
    nav: [
      { href: "/curriculum/", label: "Sobre Évelyn" },
      { href: "/clases-presenciales/", label: "Clases presenciales" },
      { href: "/bachata-salsa-online-offline/", label: "Clases online" },
      { href: "/profesora-bachata-dominicana/", label: "Máster bachata tradicional" },
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
            { label: "Sobre Évelyn", href: "/curriculum/" },
            { label: "FOTOS Keeper", href: "/keeper-galeria/" },
            { label: "Spotify", href: "/spotify/" },
            { label: "Logotipos", href: "/logotipos/" },
          ],
        },
        {
          title: "Clases",
          links: [
            { label: "Clases presenciales", href: "/clases-presenciales/" },
            { label: "Clases online", href: "/bachata-salsa-online-offline/" },
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
      legal: [
        { label: "Aviso legal", href: "/aviso-legal/" },
        { label: "Privacidad", href: "/privacidad/" },
        { label: "Cookies", href: "/cookies/" },
      ],
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
    wa: "¡Hola Évelyn! Quiero información sobre las clases.",
    waLabel: "Escríbeme por WhatsApp",
  },
  it: {
    htmlLang: "it",
    ogLocale: "it_IT",
    tagline: "La MIGLIORE insegnante e DJ di RITMI LATINI",
    credit: "Design e sviluppo a partire dal sito originale",
    nav: [
      { href: "/curriculum/", label: "Chi è Évelyn" },
      { href: "/clases-presenciales/", label: "Lezioni in presenza" },
      { href: "/bachata-salsa-online-offline/", label: "Lezioni online" },
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
            { label: "Chi è Évelyn", href: "/curriculum/" },
            { label: "Foto Keeper", href: "/keeper-galeria/" },
            { label: "Spotify", href: "/spotify/" },
            { label: "Loghi", href: "/logotipos/" },
          ],
        },
        {
          title: "Lezioni",
          links: [
            { label: "Lezioni in presenza", href: "/clases-presenciales/" },
            { label: "Lezioni online", href: "/bachata-salsa-online-offline/" },
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
      legal: [
        { label: "Note legali", href: "/aviso-legal/" },
        { label: "Privacy", href: "/privacidad/" },
        { label: "Cookie", href: "/cookies/" },
      ],
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
    wa: "Ciao Évelyn! Vorrei informazioni sulle lezioni.",
    waLabel: "Scrivimi su WhatsApp",
  },
} as const;
