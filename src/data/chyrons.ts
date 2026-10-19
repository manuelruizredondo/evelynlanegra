/* Rótulos de directo (chyrons), medidos sobre el PSD de Entregas_Directo.
   El lienzo es 2172×448 con fondo transparente: el rótulo se monta encima de
   la señal de vídeo, así que el PNG tiene que conservar el alfa. */
export const CHYRON = {
  w: 2172, h: 448,
  // La placa sola: sin sello y sin texto, con el círculo de la izquierda hueco
  fondo: "/img/chyrons/fondo.png",

  // El sello encaja en ese círculo. Cada disciplina trae el suyo, y no miden
  // igual, así que cada uno lleva su sitio y su tamaño del PSD.
  logos: [
    { id: "salsa",   nombre: "Salsa",   src: "/img/chyrons/logo-salsa.png",   x: 69, y: 106, ancho: 246, alto: 244 },
    { id: "bachata", nombre: "Bachata", src: "/img/chyrons/logo-bachata.png", x: 69, y: 106, ancho: 262, alto: 241 },
  ],

  /* Las tres franjas de texto. «base» es la línea base, no el centro: es lo
     que marca el PSD y lo que dibuja el canvas con textBaseline alfabética.
     El espaciado va en «em», como el tracking de Photoshop (±25/1000). */
  lineas: [
    { id: "categoria", etiqueta: "Categoría", valor: "SOLISTA SALSA",
      x: 405.6, base: 123.7, cuerpo: 36,   peso: 500, color: "#FCD867", espaciado: 0.025 },
    { id: "nombre", etiqueta: "Nombre", valor: "EVELYN VIANA",
      x: 398.7, base: 249.7, cuerpo: 86.5, peso: 800, color: "#FFFFFF", espaciado: -0.025 },
    { id: "pais", etiqueta: "País", valor: "ESPAÑA",
      x: 403.6, base: 348.7, cuerpo: 48,   peso: 500, color: "#FFFFFF", espaciado: 0.025 },
  ],

  /* A partir de aquí empieza el polvo de estrellas de la derecha. El texto no
     pasa de ahí: se encoge lo justo, como en los carteles. */
  anchoMax: 1480,
};
