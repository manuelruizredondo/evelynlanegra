/* Comprobación de la sesión de /interno/.
   La galleta la pone la función de borde netlify/edge-functions/interno.js;
   aquí sólo se verifica, para que las funciones acepten a quien ya ha entrado
   por la puerta y no haya que pedir la contraseña una segunda vez.

   Va en una subcarpeta a propósito: Netlify sólo convierte en endpoint los
   archivos sueltos de netlify/functions, no los de dentro de lib/. */
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "interno";
const ETIQUETA = "interno";

export const iguales = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = Buffer.from(a), y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
};

export const leerGalleta = (cabecera, nombre = COOKIE) => {
  for (const trozo of (cabecera || "").split(";")) {
    const corte = trozo.indexOf("=");
    if (corte < 0) continue;
    if (trozo.slice(0, corte).trim() === nombre) return trozo.slice(corte + 1).trim();
  }
  return null;
};

export const sesionValida = (req) => {
  const secreto = process.env.INTERNO_SECRET ?? process.env.MEDIA_SECRET;
  if (!secreto) return false;
  const valor = leerGalleta(req.headers.get("cookie"));
  if (!valor) return false;
  const corte = valor.lastIndexOf(".");
  if (corte < 0) return false;
  const exp = valor.slice(0, corte), firma = valor.slice(corte + 1);
  if (!/^\d+$/.test(exp) || Number(exp) <= Math.floor(Date.now() / 1000)) return false;
  return iguales(firma, createHmac("sha256", secreto).update(`${ETIQUETA}:${exp}`).digest("hex"));
};

// Deja pasar a quien venga con la sesión del borde o con la contraseña.
export const autorizado = (req, claveEnviada) =>
  sesionValida(req) || iguales(claveEnviada, process.env.LISTA_PASSWORD ?? "");
