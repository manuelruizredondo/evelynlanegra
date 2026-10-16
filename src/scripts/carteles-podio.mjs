/* Dibujo y lectura de datos de los carteles de ganadores.
   Lo comparten el editor manual (/interno/carteles-ganadores/) y la pestaña
   que los genera en bloque (/interno/carteles-generados/), para que un retoque
   en el cartel salga igual en los dos sitios. */

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
    return c;
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

    for (let i = 0; i < P.puestos.length; i++) {
      const d = P.puestos[i], e = estado.puestos[i];

      // El número va primero: la foto y el aro le pasan por encima y lo recortan
      const num = await cargar(`${P.numeros}${d.n}-v3.png`).catch(() => null);
      if (num) {
        const alto = d.radio * 1.18;
        const w = num.width * (alto / num.height);
        ctx.drawImage(num, d.cx - centroOptico(num) * w, d.cy - d.radio - alto * 0.86, w, alto);
      }

      const rFoto = radioFoto(d.radio * 2.2);

      ctx.save();
      ctx.beginPath(); ctx.arc(d.cx, d.cy, rFoto, 0, Math.PI * 2);
      if (e.foto) {
        ctx.clip();
        const lado = rFoto * 2 * (e.zoom ?? 1);
        const esc = Math.max(lado / e.foto.width, lado / e.foto.height);
        const w = e.foto.width * esc, h = e.foto.height * esc;
        ctx.drawImage(e.foto, d.cx - w / 2 + (e.dx ?? 0), d.cy - h / 2 + (e.dy ?? 0), w, h);
      } else {
        ctx.fillStyle = "rgba(10,32,44,.92)"; ctx.fill();
      }
      ctx.restore();

      if (aro) {
        const lado = d.radio * 2.2;
        ctx.drawImage(aro, d.cx - lado / 2, d.cy - lado / 2, lado, lado * (C.aro.alto / C.aro.ancho));
      }

      banderasEn(ctx, e.banderas, d.cx, d.cy + d.radio - d.radio * 0.42 * 0.56, d.radio * 0.42);

      texto(ctx, (e.nombre || "").toUpperCase(), d.cuerpoNombre, d.cx,
            d.cy + d.radio + d.cuerpoNombre * 1.55, d.radio * 2.5, "blanco");
      texto(ctx, (e.pais || "").toUpperCase(), d.cuerpoPais, d.cx,
            d.cy + d.radio + d.cuerpoNombre * 1.55 + d.cuerpoPais * 1.25, d.radio * 2.5, "blanco");
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
    texto(ctx, T.antetitulo, T.ante.cuerpo, T.w / 2, T.ante.centroY, T.titulo.anchoMax, "oro");

    const F = T.filas;
    const puestos = (estado.puestos || []).slice(0, F.cuantas);

    puestos.forEach((e, i) => {
      const y = F.y0 + i * F.salto;

      // Raya tenue de separación, menos debajo del último
      if (i < puestos.length - 1) {
        const g = ctx.createLinearGradient(F.numX - 26, 0, F.banderaX + F.ladoBandera, 0);
        g.addColorStop(0, "rgba(224,172,70,0)");
        g.addColorStop(0.5, "rgba(233,201,124,.34)");
        g.addColorStop(1, "rgba(224,172,70,0)");
        ctx.fillStyle = g;
        ctx.fillRect(F.numX - 26, Math.round(y + F.salto / 2 - 1), F.banderaX + F.ladoBandera - F.numX + 26, 1);
      }

      texto(ctx, String(e.puesto ?? i + 1), F.cuerpoNum, F.numX, y, 100, "oro", { alineado: "center" });

      const hayPais = Boolean(e.pais);
      texto(ctx, (e.nombre || "").toUpperCase(), F.cuerpoNombre, F.textoX,
            hayPais ? y - F.cuerpoPais * 0.72 : y, F.anchoTexto, "blanco", { alineado: "left" });
      if (hayPais) {
        texto(ctx, e.pais.toUpperCase(), F.cuerpoPais, F.textoX,
              y + F.cuerpoNombre * 0.62, F.anchoTexto, "tenue", { alineado: "left" });
      }

      banderasEn(ctx, e.banderas, F.banderaX, y - F.ladoBandera / 2, F.ladoBandera);
    });
  };

  /* ── Lectura de la hoja ── */
  const leerCSV = (txt) => {
    const filas = []; let f = [], c = "", q = false;
    for (let i = 0; i < txt.length; i++) {
      const ch = txt[i];
      if (q) { if (ch === '"' && txt[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { f.push(c); c = ""; }
      else if (ch === "\n") { f.push(c); filas.push(f); f = []; c = ""; }
      else if (ch !== "\r") c += ch;
    }
    if (c || f.length) { f.push(c); filas.push(f); }
    const cab = filas.shift().map((h) => h.trim());
    return filas.filter((r) => r.some((v) => v.trim()))
      .map((r) => Object.fromEntries(cab.map((h, i) => [h, (r[i] ?? "").trim()])));
  };

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

  // La hoja no guarda la ruta de la foto, pero sí la del PDF del que salió
  const urlFoto = (p) => {
    const foto = (p["Foto"] || "").trim();
    if (!foto) return null;
    const pdf = (p["PDF fuente"] || "").trim();
    const carpeta = pdf.includes("/") ? pdf.slice(0, pdf.lastIndexOf("/") + 1) : "";
    return C.HOJA.fotos + (carpeta + foto).split("/").map(encodeURIComponent).join("/");
  };

  const cat = (p) => [C.FASES[p["Fase"]] ?? p["Fase"], p["Categoría"], p["Disciplina"]]
    .filter(Boolean).join(" ").toUpperCase();
  const paisDe = (p) => (p["País"] || "").replace(/\s*\/\s*/g, "-").toUpperCase();

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
    cargar(P.plantilla).catch(() => {}),
    cargar(C.aro.src).catch(() => {}),
    ...[1, 2, 3].map((n) => cargar(`${P.numeros}${n}-v3.png`).catch(() => {})),
  ]);

  return {
    P, T, cargar, radioFoto, pintarPodio, pintarTop10, leerCSV, sinAcentos, sinTildes,
    banderasDeFicha, banderasDe, urlFoto, cat, paisDe, numPuesto, pruebas, nombreArchivo, precargar,
  };
}
