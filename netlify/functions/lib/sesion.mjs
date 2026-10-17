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

// Devuelve el papel de la sesión («todo» o «galeria») o null si no hay.
export const papelDe = (req) => {
  const secreto = process.env.INTERNO_SECRET ?? process.env.MEDIA_SECRET;
  if (!secreto) return null;
  const valor = leerGalleta(req.headers.get("cookie"));
  if (!valor) return null;
  const trozos = valor.split(".");
  if (trozos.length !== 3) return null;
  const [exp, papel, firma] = trozos;
  if (!/^\d+$/.test(exp) || Number(exp) <= Math.floor(Date.now() / 1000)) return null;
  if (!/^[a-z]+$/.test(papel)) return null;
  const esperada = createHmac("sha256", secreto).update(`${ETIQUETA}:${exp}:${papel}`).digest("hex");
  return iguales(firma, esperada) ? papel : null;
};

export const sesionValida = (req) => papelDe(req) !== null;

/* Sólo la sesión completa, o la contraseña a pelo, dan permisos de escritura.
   La llave de galería es de mirar: no puede subir ni borrar nada. */
export const autorizado = (req, claveEnviada) =>
  papelDe(req) === "todo" || iguales(claveEnviada, process.env.LISTA_PASSWORD ?? "");
