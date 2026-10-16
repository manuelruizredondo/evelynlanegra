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
