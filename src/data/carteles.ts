// Medidas tomadas de los PSD de competidores (lienzo 1080×1440).
export const CARTEL = {
  w: 1080, h: 1440,
  plantilla: "/img/ganadores/plantilla-base.jpg",
  aro: { src: "/img/ganadores/aro-foto.png", x: 176, y: 270, ancho: 729, alto: 716 },
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
};

// La hoja escribe «Preeliminatoria»; en el cartel va con guion
export const FASES = {
  "Preeliminatoria": "PRE-ELIMINATORIA",
  "Eliminatoria": "ELIMINATORIA",
  "Semifinal": "SEMIFINAL",
  "Final": "FINAL",
};

// Cartel de podio: un círculo grande para el ganador y dos menores al lado
export const PODIO = {
  w: 1080, h: 1440,
  numeros: "/img/ganadores/numeros/",
  // Por debajo de la barra de fechas de la plantilla, que acaba en y=178
  titulo: { centroY: 240, cuerpo: 48, anchoMax: 900 },
  puestos: [
    { n: 1, cx: 540, cy: 648, radio: 184, cuerpoNombre: 44, cuerpoPais: 36 },
    { n: 2, cx: 196, cy: 782, radio: 122, cuerpoNombre: 30, cuerpoPais: 25 },
    { n: 3, cx: 884, cy: 782, radio: 122, cuerpoNombre: 30, cuerpoPais: 25 },
  ],
  // Del 4 al 10, en dos columnas
  lista: { desde: 4, hasta: 10, y: 1046, salto: 50, colX: [140, 600], ancho: 400, cuerpo: 29 },
};
