/* Dibujo y lectura de datos de los carteles de ganadores.
   Lo comparten el editor manual (/interno/carteles-ganadores/) y la pestaña
   que los genera en bloque (/interno/carteles-generados/), para que un retoque
   en el cartel salga igual en los dos sitios. */

import { leerCSV } from "./hoja.mjs";

export function crearPodio(C) {
  const P = C.PODIO, T = C.TOP10;

  /* ── Imágenes ── */
  const img = {};
  const cargar = (src) => new Promise((ok, mal) => {
    if (img[src]) return ok(img[src]);
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => { img[src] = im; ok(im); };
    im.onerror = () => mal(new Error("no se pudo cargar " + src));
    im.src = src;
  });

  // Centro de masa horizontal de una imagen, en fracción de su ancho.
  // Los globos de los números no están centrados dentro de su propio recorte.
  const centros = {};
  const centroOptico = (im) => {
    if (centros[im.src] != null) return centros[im.src];
    const ancho = 160, alto = Math.max(1, Math.round(im.height * ancho / im.width));
    const m = document.createElement("canvas");
    m.width = ancho; m.height = alto;
    const mc = m.getContext("2d", { willReadFrequently: true });
    mc.drawImage(im, 0, 0, ancho, alto);
    const px = mc.getImageData(0, 0, ancho, alto).data;
    let suma = 0, total = 0;
    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < ancho; x++) {
        const a = px[(y * ancho + x) * 4 + 3];
        if (a) { suma += (x + 0.5) * a; total += a; }
      }
    }
    return (centros[im.src] = total ? suma / total / ancho : 0.5);
  };

  // Radio al que recortar la foto para un aro dibujado a este ancho: acaba
  // bajo la línea dorada de dentro, así queda de marco.
  const radioFoto = (anchoAro) => C.aro.radioInterior * anchoAro / C.aro.ancho;

  /* ── Texto ── */
  const oro = (ctx, y0, y1) => {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, "#FFF0CC"); g.addColorStop(0.26, "#E0AC46");
    g.addColorStop(0.58, "#E9C97C"); g.addColorStop(0.89, "#A66B12"); g.addColorStop(1, "#7D3F09");
    return g;
  };

  // Encaja el texto en «anchoMax» y lo centra por la tinta, no por la caja em.
  const texto = (ctx, t, cuerpo, cx, cy, anchoMax, relleno, opciones = {}) => {
    if (!t) return 0;
    const familia = opciones.familia ?? "Anton, sans-serif";
    const alineado = opciones.alineado ?? "center";
    ctx.font = `${cuerpo}px ${familia}`;
    let c = cuerpo;
    if (ctx.measureText(t).width > anchoMax) {
      c = cuerpo * (anchoMax / ctx.measureText(t).width);
      ctx.font = `${c}px ${familia}`;
    }
    const m = ctx.measureText(t);
    const base = cy + ((m.actualBoundingBoxAscent ?? c * 0.72) - (m.actualBoundingBoxDescent ?? 0)) / 2;
    ctx.fillStyle = relleno === "oro" ? oro(ctx, base - c * 0.74, base + c * 0.12)
      : relleno === "tenue" ? "rgba(255,255,255,.82)" : "#fff";
    ctx.textAlign = alineado; ctx.textBaseline = "alphabetic";
    ctx.fillText(t, cx, base);
    if (opciones.borde) {
      ctx.lineWidth = opciones.borde.grosor ?? 1;
      ctx.strokeStyle = opciones.borde.color;
      ctx.lineJoin = "round";
      ctx.strokeText(t, cx, base);
    }
    return c;
  };

  // Texto con espaciado entre letras. Se dibuja letra a letra porque
  // ctx.letterSpacing no mide lo mismo que pinta y en Safari ni existe.
  const textoEspaciado = (ctx, t, cuerpo, x, y, anchoMax, o = {}) => {
    if (!t) return;
    const familia = o.familia ?? '"Mona Sans","Lato",sans-serif';
    const peso = o.peso ?? 400;
    const esp = o.espaciado ?? 0.14;
    const letras = [...t];
    const fijar = (c) => { ctx.font = `${peso} ${c}px ${familia}`; };
    fijar(cuerpo);
    const avances = letras.map((ch) => ctx.measureText(ch).width / cuerpo);
    const anchoEm = avances.reduce((s, a) => s + a, 0) + esp * Math.max(0, letras.length - 1);
    const c = anchoEm * cuerpo > anchoMax ? anchoMax / anchoEm : cuerpo;
    fijar(c);
    const m = ctx.measureText(t);
    const base = y + ((m.actualBoundingBoxAscent ?? c * 0.72) - (m.actualBoundingBoxDescent ?? 0)) / 2;
    ctx.fillStyle = o.relleno ?? "#fff";
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    let px = x;
    letras.forEach((ch, i) => { ctx.fillText(ch, px, base); px += avances[i] * c + esp * c; });
  };

  // Relleno para quien no tenga foto en el servidor: un busto, recortado por
  // el mismo círculo que la foto. Va dibujado y no en un archivo, así escala
  // igual de bien en el círculo grande del ganador que en una fila del top 10.
  const FONDO_HUECO = "rgba(10,32,44,.92)";

  const silueta = (ctx, cx, cy, enc, cuantos = 1) => {
    const r = Math.min(enc.medioAncho, enc.medioAlto);
    // Un busto: cabeza y hombros, medidos sobre el radio que se le pase
    const busto = (dx, dy, escala, color) => {
      const x = cx + dx * r, y = cy + dy * r, rr = r * escala;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y - rr * 0.26, rr * 0.30, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y + rr * 0.95, rr * 0.72, Math.PI, 2 * Math.PI);
      ctx.lineTo(x + rr * 0.72, y + rr * 1.6);
      ctx.lineTo(x - rr * 0.72, y + rr * 1.6);
      ctx.closePath(); ctx.fill();
    };

    ctx.save();
    caminoEncuadre(ctx, cx, cy, enc);
    ctx.fillStyle = FONDO_HUECO; ctx.fill();
    ctx.clip();

    if (cuantos > 1) {
      // Detrás y corrida a la derecha; la de delante lleva un recorte oscuro
      // alrededor para que se vea que una tapa a la otra.
      busto(0.36, -0.12, 0.84, "rgba(233,201,124,.21)");
      busto(-0.18, 0.06, 1.12, FONDO_HUECO);
      busto(-0.18, 0.06, 1.00, "rgba(233,201,124,.38)");
    } else {
      busto(0, 0, 1, "rgba(233,201,124,.34)");
    }
    ctx.restore();
  };

  /* ── Encuadre: círculo para una persona o un dúo; rectángulo 4:3 apaisado
     con las esquinas redondeadas para los equipos, que en redondo pierden a
     los de los extremos. El ancho es el mismo en los dos casos, así que nada
     se mueve de sitio; lo que cambia es el alto, y de él cuelgan el número,
     las banderas y el nombre. ── */
  const encuadre = (e, medio) => e?.equipo
    ? { medioAncho: medio, medioAlto: medio * 0.75, rect: true }
    : { medioAncho: medio, medioAlto: medio, rect: false };

  const caminoEncuadre = (ctx, cx, cy, enc, fuera = 0) => {
    const a = enc.medioAncho + fuera, b = enc.medioAlto + fuera;
    ctx.beginPath();
    if (!enc.rect) { ctx.arc(cx, cy, a, 0, Math.PI * 2); return; }
    ctx.roundRect(cx - a, cy - b, a * 2, b * 2, Math.min(a, b) * 0.14);
  };

  const fotoEn = (ctx, im, cx, cy, enc, zoom = 1, dx = 0, dy = 0) => {
    ctx.save();
    caminoEncuadre(ctx, cx, cy, enc);
    ctx.clip();
    const escala = Math.max(enc.medioAncho * 2 * zoom / im.width,
                            enc.medioAlto * 2 * zoom / im.height);
    const w = im.width * escala, h = im.height * escala;
    ctx.drawImage(im, cx - w / 2 + dx, cy - h / 2 + dy, w, h);
    ctx.restore();
  };

  /* El aro del archivo son tres anillos dorados: sobre sus 729 px de ancho
     caen en los radios 325,5 · 346,5 · 361,5, con 4 px de grueso. Para el
     rectángulo se calcan esas mismas distancias, a escala, con las esquinas
     redondeadas, para que los dos marcos se parezcan. */
  const ANILLOS = [325.5, 346.5, 361.5].map((x) => (x - 327) / 327);
  const GRUESO = 4 / 327;

  const marcoEn = (ctx, cx, cy, enc, aro) => {
    if (!enc.rect) {
      if (!aro) return;
      const lado = enc.medioAncho / C.aro.radioInterior * C.aro.ancho;
      ctx.drawImage(aro, cx - lado / 2, cy - lado / 2, lado, lado * (C.aro.alto / C.aro.ancho));
      return;
    }
    ctx.save();
    ctx.lineJoin = "round";
    for (const sep of ANILLOS) {
      caminoEncuadre(ctx, cx, cy, enc, enc.medioAncho * sep);
      ctx.lineWidth = Math.max(1.5, enc.medioAncho * GRUESO);
      ctx.strokeStyle = oro(ctx, cy - enc.medioAlto, cy + enc.medioAlto);
      ctx.stroke();
    }
    ctx.restore();
  };

  const banderasEn = (ctx, banderas, cx, y, lado) => {
    if (!banderas?.length) return;
    const total = banderas.length * lado + (banderas.length - 1) * lado * 0.14;
    let bx = cx - total / 2;
    for (const b of banderas) { ctx.drawImage(b, bx, y, lado, lado); bx += lado * 1.14; }
  };

  /* ── Cartel de podio: 1 grande, 2 y 3 a los lados ── */
  const pintarPodio = async (ctx, estado) => {
    const base = await cargar(P.plantilla);
    ctx.clearRect(0, 0, P.w, P.h);
    ctx.drawImage(base, 0, 0, P.w, P.h);
    texto(ctx, (estado.titulo || "").toUpperCase(), P.titulo.cuerpo, P.w / 2,
          P.titulo.centroY, P.titulo.anchoMax, "blanco");

    const aro = await cargar(C.aro.src).catch(() => null);

    // Con lista debajo, el podio se queda arriba; sin ella baja al centro
    const hayLista = Boolean((estado.lista || "").trim());
    const baja = hayLista ? 0 : (P.bajaSinLista ?? 0);

    for (let i = 0; i < P.puestos.length; i++) {
      const d = { ...P.puestos[i], cy: P.puestos[i].cy + baja };
      const e = estado.puestos[i];

      // El número va primero: la foto y el aro le pasan por encima y lo recortan
      const encN = encuadre(e, radioFoto(d.radio * 2.2));
      const arribaN = d.cy - encN.medioAlto;

      const num = await cargar(`${P.numeros}${d.n}-v3.png`).catch(() => null);
      if (num) {
        const alto = d.radio * 1.18;
        const w = num.width * (alto / num.height);
        ctx.drawImage(num, d.cx - centroOptico(num) * w, arribaN - alto * 0.86, w, alto);
      }

      const rFoto = radioFoto(d.radio * 2.2);
      const enc = encuadre(e, rFoto);
      const abajo = d.cy + enc.medioAlto;   // borde inferior del encuadre

      if (e.foto) {
        fotoEn(ctx, e.foto, d.cx, d.cy, enc, e.zoom ?? 1, e.dx ?? 0, e.dy ?? 0);
      } else if (e.nombre) {
        // Hay alguien, pero su foto no está en el servidor
        silueta(ctx, d.cx, d.cy, enc, e.duo ? 2 : 1);
      } else {
        ctx.save();
        caminoEncuadre(ctx, d.cx, d.cy, enc);
        ctx.fillStyle = "rgba(10,32,44,.92)"; ctx.fill();
        ctx.restore();
      }

      marcoEn(ctx, d.cx, d.cy, enc, aro);

      banderasEn(ctx, e.banderas, d.cx, abajo - d.radio * 0.42 * 0.56, d.radio * 0.42);

      texto(ctx, (e.nombre || "").toUpperCase(), d.cuerpoNombre, d.cx,
            abajo + d.cuerpoNombre * 1.55, d.radio * 2.5, "blanco");
      texto(ctx, (e.pais || "").toUpperCase(), d.cuerpoPais, d.cx,
            abajo + d.cuerpoNombre * 1.55 + d.cuerpoPais * 1.25, d.radio * 2.5, "blanco");
    }

    // Del 4 al 10, en dos columnas
    const filas = (estado.lista || "").split("\n").map((l) => l.trim()).filter(Boolean);
    const L = P.lista;
    filas.slice(0, L.hasta - L.desde + 1).forEach((fila, i) => {
      const y = L.y + (i % 4) * L.salto;
      const x = L.colX[i < 4 ? 0 : 1];
      const [nombre, pais] = fila.split(",").map((s) => s.trim());
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.font = `${L.cuerpo}px Anton, sans-serif`;
      ctx.fillStyle = oro(ctx, y - L.cuerpo * 0.6, y + L.cuerpo * 0.3);
      ctx.fillText(`${L.desde + i}`, x, y);
      ctx.fillStyle = "#fff";
      ctx.font = `${L.cuerpo * 0.86}px Anton, sans-serif`;
      ctx.fillText((nombre || "").toUpperCase(), x + 52, y - 2);
      if (pais) {
        ctx.font = `${L.cuerpo * 0.66}px Anton, sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,.82)";
        ctx.fillText(pais.toUpperCase(), x + 52, y + L.cuerpo * 0.72);
      }
    });
  };

  /* ── Cartel del top 10: los diez, uno debajo de otro ── */
  const pintarTop10 = async (ctx, estado) => {
    const base = await cargar(T.plantilla);
    ctx.clearRect(0, 0, T.w, T.h);
    ctx.drawImage(base, 0, 0, T.w, T.h);
    texto(ctx, (estado.titulo || "").toUpperCase(), T.titulo.cuerpo, T.w / 2,
          T.titulo.centroY, T.titulo.anchoMax, "blanco");
    texto(ctx, T.antetitulo, T.ante.cuerpo, T.w / 2, T.ante.centroY, T.titulo.anchoMax, "oro",
          { borde: T.ante.borde });

    const F = T.filas;
    const puestos = (estado.puestos || []).slice(0, F.cuantas);

    puestos.forEach((e, i) => {
      const y = F.y0 + i * F.salto;

      // Raya tenue de separación, menos debajo del último
      if (i < puestos.length - 1) {
        const izq = F.numX - 26, der = F.foto.cx + F.foto.radio;
        const g = ctx.createLinearGradient(izq, 0, der, 0);
        g.addColorStop(0, "rgba(224,172,70,0)");
        g.addColorStop(0.5, "rgba(233,201,124,.34)");
        g.addColorStop(1, "rgba(224,172,70,0)");
        ctx.fillStyle = g;
        ctx.fillRect(izq, Math.round(y + F.salto / 2 - 1), der - izq, 1);
      }

      const hayPais = Boolean(e.pais);
      const yNombre = hayPais ? y - F.cuerpoPais * 0.72 : y;

      // El número va a la altura del nombre, no al centro de la fila
      texto(ctx, String(e.puesto ?? i + 1), F.cuerpoNum, F.numX, yNombre, 100, "oro", { alineado: "center" });

      texto(ctx, (e.nombre || "").toUpperCase(), F.cuerpoNombre, F.textoX,
            yNombre, F.anchoTexto, "blanco", { alineado: "left" });
      if (hayPais) {
        textoEspaciado(ctx, e.pais.toUpperCase(), F.cuerpoPais, F.textoX,
                       y + F.cuerpoNombre * 0.62, F.anchoTexto,
                       { familia: F.familiaPais, peso: F.pesoPais, espaciado: F.espaciadoPais });
      }

      // La foto, a la derecha y con la altura de la fila
      const f = F.foto;
      const encF = encuadre(e, f.radio);
      if (e.foto) fotoEn(ctx, e.foto, f.cx, y, encF);
      else silueta(ctx, f.cx, y, encF, e.duo ? 2 : 1);
      // El filo va igual haya foto o silueta, para que la fila no cambie
      caminoEncuadre(ctx, f.cx, y, encF, -1);
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.strokeStyle = oro(ctx, y - encF.medioAlto, y + encF.medioAlto);
      ctx.stroke();
    });
  };

  /* ── Lectura de la hoja ── */
  const sinAcentos = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const sinTildes = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // La hoja ya dice qué bandera lleva cada ficha, con el nombre del archivo
  // que está subido al servidor. Es la vía buena: nada que adivinar.
  const banderasDeFicha = (p) => ["Bandera 1", "Bandera 2"]
    .map((c) => (p?.[c] || "").trim())
    .filter(Boolean).slice(0, 2)
    .map((a) => C.HOJA.banderas + encodeURIComponent(a));

  // Para un país escrito a mano: primero se busca una ficha de la hoja con ese
  // mismo país; si no aparece, se cae al juego local, mirando antes la
  // traducción al inglés, que es la del icono redondo.
  const banderasDe = (pais, fichas = []) => {
    const clave = sinAcentos(pais);
    const ficha = clave && fichas.find((f) => sinAcentos(f["País"]) === clave && (f["Bandera 1"] || "").trim());
    if (ficha) return banderasDeFicha(ficha);
    return (pais || "").split(/[\/\-]/)
      .map((p) => sinAcentos(p)).filter(Boolean)
      .map((p) => {
        const archivo = (C.ES_EN[p] && C.BANDERAS.includes(C.ES_EN[p])) ? C.ES_EN[p]
          : (C.BANDERAS.includes(p) ? p : null);
        return archivo ? `/img/banderas/${archivo}.png` : null;
      })
      .filter(Boolean).slice(0, 2);
  };

  /* La hoja no guarda la ruta de la foto, pero sí la del PDF del que salió.
     Cuando esa columna viene vacía —34 filas— la carpeta se deduce del nombre
     de la disciplina, la categoría y la fase, que es como están ordenadas en
     el servidor: fotos_salsa/duo_femenino_salsa/semifinal/. Comprobado contra
     las 395 rutas que la hoja sí trae: acierta las 395.
     Algunas categorías no tienen subcarpeta de fase, así que se devuelven
     varias candidatas y se prueban por orden. */
  const aRuta = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

  const urlsFoto = (p) => {
    const foto = (p["Foto"] || "").trim();
    if (!foto) return [];
    const enlace = (ruta) => C.HOJA.fotos + ruta.split("/").map(encodeURIComponent).join("/");

    const pdf = (p["PDF fuente"] || "").trim();
    if (pdf.includes("/")) return [enlace(pdf.slice(0, pdf.lastIndexOf("/") + 1) + foto)];

    const d = aRuta(p["Disciplina"]), c = aRuta(p["Categoría"]);
    let f = aRuta(p["Fase"]);
    if (f === "preeliminatoria") f = "pre_eliminatoria";
    const base = `fotos_${d}/${c}_${d}/`;
    return [...(f ? [enlace(base + f + "/" + foto)] : []), enlace(base + foto), enlace(foto)];
  };

  // Compatibilidad: la primera candidata
  const urlFoto = (p) => urlsFoto(p)[0] ?? null;

  // Prueba las candidatas por orden y devuelve la primera que cargue
  const cargarFoto = async (p) => {
    for (const u of urlsFoto(p)) {
      const im = await cargar(u).catch(() => null);
      if (im) return im;
    }
    return null;
  };

  const cat = (p) => [C.FASES[p["Fase"]] ?? p["Fase"], p["Categoría"], p["Disciplina"]]
    .filter(Boolean).join(" ").toUpperCase();
  const paisDe = (p) => (p["País"] || "").replace(/\s*\/\s*/g, "-").toUpperCase();

  // Para la silueta de relleno: solista va solo, lo demás (dúos, parejas,
  // equipos) se dibuja con dos figuras.
  const esDuo = (p) => !/solista/i.test(p?.["Categoría"] || "");

  // Los equipos no caben en un círculo: van en rectángulo 4:3 apaisado
  const esEquipo = (p) => /equipo/i.test(p?.["Categoría"] || "");

  const numPuesto = (p) => {
    const n = parseInt(String(p["Puesto"] ?? "").replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) && n >= 1 ? n : null;
  };

  // Una prueba es cada disciplina + categoría + fase; dentro van sus puestos.
  const pruebas = (fichas) => {
    const m = new Map();
    for (const p of fichas) {
      const n = numPuesto(p);
      if (!n) continue;
      const k = [p["Disciplina"], p["Categoría"], p["Fase"]].join("\u0001");
      if (!m.has(k)) m.set(k, []);
      m.get(k).push({ ...p, __puesto: n });
    }
    for (const v of m.values()) v.sort((a, b) => a.__puesto - b.__puesto);
    return m;
  };

  const nombreArchivo = (t) => (t || "cartel").toLowerCase().normalize("NFD")
    .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Fuente, plantilla, aro y globos: sin esto el primer pintado sale soso
  const precargar = () => Promise.all([
    document.fonts.load("54px Anton"),
    document.fonts.load('400 24px "Mona Sans"'),
    cargar(P.plantilla).catch(() => {}),
    cargar(C.aro.src).catch(() => {}),
    ...[1, 2, 3].map((n) => cargar(`${P.numeros}${n}-v3.png`).catch(() => {})),
  ]);

  return {
    P, T, cargar, radioFoto, pintarPodio, pintarTop10, leerCSV, sinAcentos, sinTildes,
    banderasDeFicha, banderasDe, urlFoto, urlsFoto, cargarFoto, cat, paisDe, esDuo, esEquipo,
    numPuesto, pruebas, nombreArchivo, precargar,
  };
}
