// Medidas tomadas de los PSD de competidores (lienzo 1080×1440).
export const CARTEL = {
  w: 1080, h: 1440,
  plantilla: "/img/ganadores/plantilla-base.jpg",
  // «radioInterior» es el radio, en píxeles de este archivo, donde tiene que
  // acabar la foto: la línea dorada de dentro ocupa de 323,5 a 327,5 en
  // horizontal y arranca en 327 en vertical, así que a 327 el borde de la foto
  // queda tapado por el oro y no asoma por ningún lado.
  aro: { src: "/img/ganadores/aro-foto.png", x: 176, y: 270, ancho: 729, alto: 716, radioInterior: 327 },
  // La foto va recortada en círculo, por dentro del aro
  foto: { cx: 541, cy: 628, radio: 330 },
  // Chapa de categoría: dorada, se ensancha según el texto
  chapa: { centroX: 540, y: 208, alto: 43, color: "#846037",
           cuerpo: 27, tracking: 0.055, margen: 22 },
  // Banderas: una o dos, centradas bajo la foto
  banderas: { centroX: 540, centroY: 941, lado: 146, hueco: 16 },
  // Nombre y país, en dos líneas
  nombre:  { centroX: 540, centroY: 1086, cuerpo: 108, tracking: 0.04, anchoMax: 760 },
  pais:    { centroX: 540, centroY: 1180, cuerpo: 99,  tracking: 0.04, anchoMax: 760 },
};

export const CATEGORIAS = [
  "PRE-ELIMINATORIA SOLISTA FEMENINO SALSA",
  "ELIMINATORIA SOLISTA FEMENINO SALSA",
  "SEMIFINAL SOLISTA FEMENINO SALSA",
  "FINAL SOLISTA FEMENINO SALSA",
  "ELIMINATORIA SOLISTA MASCULINO SALSA",
  "FINAL SOLISTA MASCULINO SALSA",
  "FINAL DÚO MASCULINO SALSA",
  "FINAL DÚO FEMENINO SALSA",
  "FINAL DÚOS BACHATA",
  "FINAL PAREJAS SALSA",
  "SEMIFINAL PAREJAS SALSA",
  "FINAL PAREJAS BACHATA",
];

// Hoja de participantes. Se lee en vivo, así que basta con editarla en Drive.
export const HOJA = {
  // Sin «gid»: con él Google responde 400 en este archivo, que es un xlsx subido.
  // La primera hoja es la de participantes.
  url: "https://docs.google.com/spreadsheets/d/1vnJX7NtPSsUND_By7sWPiNUD3XpHbNtX/export?format=csv",
  // Las fotos cuelgan de aquí, con la misma estructura de carpetas que la
  // columna «PDF fuente» de la hoja
  fotos: "https://media.lanegrasalsa.com/media/competidores2026/",
  // Las banderas también están en el servidor, nombradas con el código ISO
  // que la hoja guarda en «Bandera 1» y «Bandera 2» (it.png, es.png, …)
  banderas: "https://media.lanegrasalsa.com/media/competidores2026/banderas/",
};

// La hoja escribe «Preeliminatoria»; en el cartel va con guion
export const FASES = {
  "Preeliminatoria": "PRE-ELIMINATORIA",
  "Eliminatoria": "ELIMINATORIA",
  "Semifinal": "SEMIFINAL",
  "Final": "FINAL",
};

// Cartel de podio: un círculo grande para el ganador y dos menores al lado
/* Plantilla nueva, 1080×1350, con el sello del 15 aniversario cambiado. La
   cabecera y el pie miden lo mismo que en la de 1440 —el dibujo no se ha
   escalado, sólo se ha acortado el fondo—, así que el hueco libre pasa de
   131…1250 (1120 px) a 117…1154 (1038 px). Todo lo de aquí abajo que sea
   vertical, medidas y cuerpos de letra, va al 92,7 % de lo que medía: es la
   misma composición de antes, encogida para que quepa con los mismos aires. */
export const PODIO = {
  w: 1080, h: 1350,
  // Plantilla propia: sin los escudos laterales ni la barra de fechas, que
  // en el cartel de podio sobran y le quitan sitio al título
  plantilla: "/img/ganadores/plantilla-podio-1350.jpg",
  numeros: "/img/ganadores/numeros/",
  // Por debajo de la barra negra de la cabecera, que acaba en y=116
  titulo: { centroY: 214, cuerpo: 48, anchoMax: 940 },
  // Aquí van sólo los tres primeros —del 4 al 10 se encarga el cartel del top
  // 10—, así que el podio se baja esto para no dejar vacío el tercio de abajo.
  baja: 82,
  puestos: [
    { n: 1, cx: 540, cy: 596, radio: 171, cuerpoNombre: 41, cuerpoPais: 33 },
    { n: 2, cx: 196, cy: 720, radio: 113, cuerpoNombre: 28, cuerpoPais: 23 },
    { n: 3, cx: 884, cy: 720, radio: 113, cuerpoNombre: 28, cuerpoPais: 23 },
  ],
};

/* Versión 16:9 (1920×1080) del podio, para pantalla. No hay plantilla propia
   horizontal, así que va sobre el fondo submarino de las portadas y se le pone
   el sello del 15 aniversario para que lleve marca. Los tres puestos se
   reparten a lo ancho: el ganador en el centro y más grande, 2 y 3 a los lados. */
export const PODIO_16 = {
  w: 1920, h: 1080,
  plantilla: "/img/portadas/fondo-gran-final.jpg",
  numeros: "/img/ganadores/numeros/",
  titulo: { centroY: 82, cuerpo: 54, anchoMax: 1560 },
  baja: 0,
  sello: { src: "/img/portadas/sello-15-v2.png", x: 70, y: 915, ancho: 140, alto: 121 },
  puestos: [
    { n: 1, cx: 960,  cy: 600, radio: 196, cuerpoNombre: 46, cuerpoPais: 36 },
    { n: 2, cx: 410,  cy: 638, radio: 138, cuerpoNombre: 33, cuerpoPais: 26 },
    { n: 3, cx: 1510, cy: 638, radio: 138, cuerpoNombre: 33, cuerpoPais: 26 },
  ],
};

/* Versión 16:9 del top 10: dos columnas de cinco, que a lo ancho quedan mucho
   mejor que una sola columna estirada. Mismo fondo y sello que el podio 16:9. */
export const TOP10_16 = {
  w: 1920, h: 1080,
  plantilla: "/img/portadas/fondo-gran-final.jpg",
  antetitulo: "CLASIFICACIÓN",
  restantes: { desde: 4, hasta: 10 },
  ante: { centroY: 168, cuerpo: 52, borde: { color: "#3E1F05", grosor: 1 } },
  titulo: { centroY: 90, cuerpo: 44, anchoMax: 1560 },
  sello: { src: "/img/portadas/sello-15-v2.png", x: 905, y: 946, ancho: 110, alto: 95 },
  filas: {
    cuantas: 10,
    // Dos columnas: las cinco primeras a la izquierda, las cinco siguientes a
    // la derecha, desplazadas «colAncho» en horizontal.
    columnas: 2, colAncho: 950,
    y0: 300, salto: 138,
    numX: 120, textoX: 212, anchoTexto: 520,
    foto: { cx: 832, radio: 46 },
    cuerpoNum: 48, cuerpoNombre: 34, cuerpoPais: 18,
    familiaPais: '"Mona Sans","Lato",sans-serif', pesoPais: 400, espaciadoPais: 0.16,
  },
};

// Cartel del top 10: los diez uno debajo de otro. La plantilla sólo tiene
// contenido propio hasta y=116 (cabecera) y a partir de 1155 (pie), así que
// las filas caben holgadas entre medias.
export const TOP10 = {
  w: 1080, h: 1350,
  plantilla: "/img/ganadores/plantilla-podio-1350.jpg",
  antetitulo: "CLASIFICACIÓN",
  // Los tres primeros salen del podio; estos se buscan a mano en el editor
  restantes: { desde: 4, hasta: 10 },
  // Reborde de 1 px en oro muy oscuro, para que despegue del fondo
  ante: { centroY: 262, cuerpo: 54, borde: { color: "#3E1F05", grosor: 1 } },
  titulo: { centroY: 194, cuerpo: 48, anchoMax: 940 },
  filas: {
    cuantas: 10,
    y0: 377, salto: 81,
    numX: 142, textoX: 232, anchoTexto: 640,
    // A la derecha, la foto a la altura de la fila. Aquí no van banderas: el
    // país ya está escrito debajo del nombre.
    foto: { cx: 958, radio: 37 },
    cuerpoNum: 50, cuerpoNombre: 35, cuerpoPais: 19,
    // El país va en la tipografía de texto, no en la de titulares
    familiaPais: '"Mona Sans","Lato",sans-serif', pesoPais: 400, espaciadoPais: 0.16,
  },
};
