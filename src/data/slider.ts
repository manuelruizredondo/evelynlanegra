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
};

export const slides: Slide[] = [
  { type: "video", src: "/media/evelyn-bailando.mp4", poster: "/media/evelyn-bailando.jpg",
    alt: "Teacher Training 2026 con Évelyn «La Negra»",
    title: "Teacher Training", subtitle: "2026", sound: true },
  { type: "image", src: "/media/evelyn-social.jpg", alt: "Évelyn «La Negra» en la pista" },
  { type: "image", src: "/media/clases-barcelona.jpg", alt: "Clases de bachata tradicional en Barcelona · BS Dance Center" },
  { type: "image", src: "/media/clases-ibiza.jpg", alt: "Clases de salsa y bachata en Ibiza" },
  { type: "image", src: "/media/intensivos-ibiza.jpg", alt: "Intensivos de septiembre en Ibiza" },
];
