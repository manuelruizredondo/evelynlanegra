/* Lectura de la hoja de participantes.
   La comparten el generador de carteles y el de portadas, para que las dos
   lean el CSV igual: comillas, saltos dentro de celda y cabecera recortada. */

export const leerCSV = (txt) => {
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

export const cargarHoja = async (url) => leerCSV(await (await fetch(url)).text());
