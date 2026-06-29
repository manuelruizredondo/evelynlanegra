# La Negra Salsa — web en Astro

Web estática de **La Negra Salsa** (Évelyn Viana Lovera) construida en **Astro**,
con CSS propio, sin rastro de WordPress y lista para **Netlify**.

## Stack

- **Astro 4** (salida estática, 0 JS salvo el toggle del menú móvil).
- CSS propio con tokens de marca (`src/styles/global.css`).
- Fuentes self-hosted: **Lato** + **Dancing Script** (`public/fonts/`).
- Formularios con **Netlify Forms** (funcionan sin backend).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Estructura

```
src/
  layouts/Base.astro          Layout (head, header, footer)
  components/
    Header.astro              Nav + menú móvil (clase en <body> + transform)
    Footer.astro
    Banner.astro              Sección full-width con imagen de fondo + CTA
    FeatureSplit.astro        Fila imagen + texto + CTA
    ContactBand.astro         Franja de teléfono / WhatsApp
    ContactForm.astro         Formulario (Netlify Forms)
    GalleryNav.astro          Página de botones para las galerías Keeper
  data/site.ts                Datos del sitio: contacto, menú
  pages/                      Una página por ruta
  styles/global.css           Sistema de diseño (tokens, botones, banners)
public/
  img/                        Imágenes (rutas /img/AAAA/MM/…)
  fonts/                      Fuentes self-hosted
  _redirects                  URLs antiguas /es/… -> nuevas rutas
  robots.txt
```

## Páginas

`/` · `/curriculum/` · `/clases-de-baile-en-barcelona/` · `/clases-de-baile-en-ibiza/`
· `/bachata-salsa-online-offline/` · `/profesora-bachata-dominicana/` · `/logotipos/`
· `/blog/` · `/keeper-galeria/` (+ eventos 2025 / 2026) · `/gracias/` · `404`

Las galerías Keeper son páginas de navegación (botones). Las fotos de cada evento
(cargadas por JS en el sitio original) **enlazan al sitio en vivo**, según lo acordado.

## Despliegue en Netlify

Conecta el repositorio; Netlify detecta `netlify.toml`:

- **Build command:** `npm run build`
- **Publish:** `dist`

Los formularios aparecerán en el panel **Forms** de Netlify (configura ahí el aviso
por email).

## Pendiente de confirmar

- `src/data/site.ts`: el **email** es un marcador (`info@lanegrasalsa.com`); ponlo real.
- `astro.config.mjs`: `site` apunta a `lanegrasalsa.netlify.app`; cámbialo por el
  dominio definitivo (afecta a las URLs canónicas y al sitemap).
