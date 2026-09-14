// Slider de la home. Añade aquí cada vídeo o foto que quieras mostrar.
// - Vídeos: guarda el .mp4 en public/media/ y añade { type: "video", src: "/media/nombre.mp4", poster: "/media/nombre.jpg" (opcional) }
//   (se reproducen solos, en bucle y sin sonido cuando entran en pantalla)
// - Fotos:  guarda la imagen en public/media/ y añade { type: "image", src: "/media/nombre.jpg", alt: "descripción" }
// Nombres de archivo sin tildes ni espacios.

export type Slide = {
  type: "video" | "image";
  src: string;
  poster?: string;   // solo vídeos: imagen de portada antes de reproducirse
  alt?: string;      // descripción accesible / SEO
  title?: string;    // texto sobre el degradado inferior
  subtitle?: string; // segunda línea (p. ej. el año)
  sound?: boolean;   // solo vídeos: muestra el botón para activar el audio
  href?: string;     // si la pieza tiene página propia (un evento, por ejemplo)
};

export const slides: Slide[] = [
  { type: "image", src: "/media/convivencia-merenguera.jpg",
    alt: "Convivencia Merenguera en Ibiza, domingo 20 de septiembre de 18 a 21 h",
    title: "Convivencia Merenguera", subtitle: "Ibiza · 20 sept",
    href: "/convivencia-merenguera/" },
  { type: "image", src: "/media/keeper-opening.jpg",
    alt: "Keeper Opening en Ibiza, domingo 20 de septiembre desde las 20:30 h",
    title: "Keeper Opening", subtitle: "Ibiza · 20 sept",
    href: "/keeper-opening/" },
  { type: "video", src: "/media/evelyn-bailando.mp4", poster: "/media/evelyn-bailando.jpg",
    alt: "Teacher Training 2026 con Evelyn «La Negra»",
    title: "Teacher Training", subtitle: "2026", sound: true },
  { type: "image", src: "/media/evelyn-social.jpg", alt: "Evelyn «La Negra» en la pista" },
  { type: "image", src: "/media/clases-barcelona.jpg", alt: "Clases de bachata tradicional en Barcelona · BS Dance Center" },
  { type: "image", src: "/media/clases-ibiza.jpg", alt: "Clases de salsa y bachata en Ibiza" },
  { type: "image", src: "/media/intensivos-ibiza.jpg", alt: "Intensivos de septiembre en Ibiza" },
];
