// Entrega un permiso de subida firmado y caduco.
// El secreto se queda aquí: al navegador solo le llega la firma.
import { createHmac, timingSafeEqual } from "node:crypto";

const MINUTOS = 20;

const claveValida = (recibida, esperada) => {
  if (typeof recibida !== "string" || !esperada) return false;
  const a = Buffer.from(recibida);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
};

export default async (req) => {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const clave = process.env.LISTA_PASSWORD;
  const secreto = process.env.MEDIA_SECRET;
  const endpoint = process.env.MEDIA_ENDPOINT;

  if (!clave) return json({ error: "Falta la variable LISTA_PASSWORD en Netlify." }, 500);
  if (!secreto) return json({ error: "Falta la variable MEDIA_SECRET en Netlify." }, 500);
  if (!endpoint) return json({ error: "Falta la variable MEDIA_ENDPOINT en Netlify." }, 500);

  let cuerpo = {};
  try { cuerpo = await req.json(); } catch { /* cuerpo vacío */ }

  if (!claveValida(cuerpo.clave, clave)) {
    await new Promise((r) => setTimeout(r, 700));
    return json({ error: "Contraseña incorrecta." }, 401);
  }

  const exp = String(Math.floor(Date.now() / 1000) + MINUTOS * 60);
  const sig = createHmac("sha256", secreto).update(exp).digest("hex");

  return json({ endpoint, exp, sig, caduca: MINUTOS });
};
