// Medidas tomadas del PSD original (lienzo 1920×1080).
// Las tres líneas de texto ocupan el mismo ancho a propósito: el cuerpo se
// recalcula para que cualquier texto llene la caja y la portada no baile.
export const LIENZO = { w: 1920, h: 1080 };

export const CAJA = { x: 614, ancho: 690 };

// centroY y cuerpoMax salen de medir la tinta del PSD aplanado. Cada línea
// tiene su propio cuerpo: lo que comparten es el ancho de caja, no el tamaño.
export const LINEAS = [
  { id: "linea1", etiqueta: "Primera línea", valor: "GRAN FINAL",
    peso: 400, tracking: 0.10, centroY: 413, cuerpoMax: 130, mayusculas: true, dorado: true },
  { id: "linea2", etiqueta: "Segunda línea", valor: "SOLISTA",
    peso: 400, tracking: 0.05, centroY: 598, cuerpoMax: 165, mayusculas: true },
  { id: "linea3", etiqueta: "Tercera línea", valor: "BACHATA",
    peso: 800, tracking: -0.025, centroY: 720, cuerpoMax: 152, mayusculas: true },
];

export const REGLA = { x: 616, y: 484, ancho: 691, grosor: 9, dorado: true };

// Puntos de brillo, en proporción a la caja de texto. La fase los desacompasa
// para que no parpadeen todos a la vez.
export const DESTELLOS = [
  // Clavado en el remate de la última letra, se escriba lo que se escriba
  { anclaje: "finTexto", dx: 4, dy: -4, radio: 17, fase: 0.0 },
  { anclaje: "regla", px: 0.012, radio: 15, fase: 2.1 },
  { anclaje: "regla", px: 0.78,  radio: 11, fase: 1.1 },
];

// Los dos escudos del campeonato, con el texto del aro en blanco para que se
// lea sobre el fondo oscuro. Los originales lo traen en negro.
export const LOGOS = [
  { id: "salsa", nombre: "Salsa · XV", src: "/img/portadas/logo-salsa-blanco.png" },
  { id: "bachata", nombre: "Bachata · VI", src: "/img/portadas/logo-bachata-blanco.png" },
];

// Piezas que no se tocan
export const FIJOS = {
  fondo: "/img/portadas/fondo-gran-final.jpg",
  fondoVideo: "/img/portadas/fondo-gran-final.mp4",
  // Centrado en el lienzo; el tamaño se regula desde la propia página.
  // El tope lo marca «GRAN FINAL», cuya tinta empieza en y=368.
  logoCaja: { centroX: 960, centroY: 209, lado: 280, min: 160, max: 320 },
  sello: { src: "/img/portadas/sello-15-aniversario.png", x: 870, y: 846, ancho: 189, alto: 180 },
  hotel: { src: "/img/portadas/logo-diamante-beach.png", x: 1637, y: 889, ancho: 183, alto: 137 },
};
