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
  // Llena el ancho como las otras dos. Como una palabra corta como «SALSA»
  // necesita cuerpo 208 para llegar a los 690 px, se ancla por el borde de
  // arriba y crece hacia abajo: así no se come la línea de encima y la tinta
  // siempre empieza a la misma altura, mida lo que mida. Abajo tiene hasta el
  // sello del aniversario, que empieza en y=846.
  { id: "linea3", etiqueta: "Tercera línea", valor: "BACHATA",
    peso: 800, tracking: -0.025, altoY: 672, cuerpoMax: 210, mayusculas: true },
];

export const REGLA = { x: 616, y: 484, ancho: 691, grosor: 9, dorado: true };

// Puntos de brillo, en proporción a la caja de texto. La fase los desacompasa
// para que no parpadeen todos a la vez.
export const DESTELLOS = [
  // En la punta del asta de la última letra —el palito de la L—, que es el
  // borde de arriba por la izquierda de su tinta, no la esquina de la caja
  { anclaje: "finTexto", dx: 0, dy: -2, radio: 17, fase: 0.0 },
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

// Finales y semifinales del programa de los días 23, 24 y 25, en el orden de
// la jornada. Sale de aquí y no de la hoja de participantes: la hoja sólo
// sabe de inscritos y no cuadra con lo que de verdad se compite.
export const PROGRAMA = [
  // Viernes 23
  { dia: "Viernes 23", fase: "SEMIFINAL", categoria: "Solistas Chicas", disciplina: "Bachata" },
  { dia: "Viernes 23", fase: "SEMIFINAL", categoria: "Solistas Chicas", disciplina: "Salsa" },
  { dia: "Viernes 23", fase: "GRAN FINAL", categoria: "Solistas Chicos", disciplina: "Bachata" },
  // «19:00 Final solistas chicas», sin especialidad en el programa: va como
  // bachata porque su semifinal es la de las 13:00. Confirmar.
  { dia: "Viernes 23", fase: "GRAN FINAL", categoria: "Solistas Chicas", disciplina: "Bachata", dudoso: true },
  { dia: "Viernes 23", fase: "GRAN FINAL", categoria: "Dúos Chicas", disciplina: "Salsa" },
  { dia: "Viernes 23", fase: "GRAN FINAL", categoria: "Dúos Chicos", disciplina: "Salsa" },
  { dia: "Viernes 23", fase: "GRAN FINAL", categoria: "Solistas Chicas", disciplina: "Salsa" },
  // Sábado 24
  { dia: "Sábado 24", fase: "SEMIFINAL", categoria: "Solistas Chicos", disciplina: "Salsa" },
  { dia: "Sábado 24", fase: "SEMIFINAL", categoria: "Dúos Mixtos", disciplina: "Bachata" },
  { dia: "Sábado 24", fase: "SEMIFINAL", categoria: "Parejas", disciplina: "Salsa" },
  { dia: "Sábado 24", fase: "GRAN FINAL", categoria: "Solistas Chicos", disciplina: "Salsa" },
  { dia: "Sábado 24", fase: "GRAN FINAL", categoria: "Equipos", disciplina: "Salsa" },
  // Domingo 25
  { dia: "Domingo 25", fase: "GRAN FINAL", categoria: "Parejas", disciplina: "Bachata" },
  { dia: "Domingo 25", fase: "GRAN FINAL", categoria: "Dúos Mixtos", disciplina: "Bachata" },
  { dia: "Domingo 25", fase: "GRAN FINAL", categoria: "Parejas", disciplina: "Salsa" },
  { dia: "Domingo 25", fase: "GRAN FINAL", categoria: "Equipos", disciplina: "Bachata" },
];

// Capas de partículas, sobre fondo negro. Se superponen en modo «screen»: el
// negro desaparece solo y quedan las chispas, sin recortar nada.
export const PARTICULAS = [
  { id: "chispas", nombre: "Chispas", src: "/img/portadas/particulas-doradas.mp4" },
  { id: "polvo", nombre: "Polvo dorado", src: "/img/portadas/particulas-polvo.mp4" },
];
