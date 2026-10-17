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
  // Sin la lista del 4 al 10, el podio dejaba vacío todo el tercio de abajo y
  // la composición quedaba arriba. Cuando no hay lista, baja esto. Con lista
  // se queda donde estaba, que si no se le echaría encima.
  bajaSinLista: 82,
  puestos: [
    { n: 1, cx: 540, cy: 596, radio: 171, cuerpoNombre: 41, cuerpoPais: 33 },
    { n: 2, cx: 196, cy: 720, radio: 113, cuerpoNombre: 28, cuerpoPais: 23 },
    { n: 3, cx: 884, cy: 720, radio: 113, cuerpoNombre: 28, cuerpoPais: 23 },
  ],
  // Del 4 al 10, en dos columnas
  lista: { desde: 4, hasta: 10, y: 965, salto: 46, colX: [140, 600], ancho: 400, cuerpo: 27 },
};

// Cartel del top 10: los diez uno debajo de otro. La plantilla sólo tiene
// contenido propio hasta y=116 (cabecera) y a partir de 1155 (pie), así que
// las filas caben holgadas entre medias.
export const TOP10 = {
  w: 1080, h: 1350,
  plantilla: "/img/ganadores/plantilla-podio-1350.jpg",
  antetitulo: "CLASIFICACIÓN",
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
