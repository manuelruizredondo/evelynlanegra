/* Listado de lo ya publicado en el servidor de medios, de sólo lectura.
   Existe para que la llave de galería no necesite un permiso de subida: ese
   permiso sirve igual para subir y para borrar, así que no puede bajar al
   navegador de quien sólo tiene que mirar. Aquí se firma en el servidor, se
   pregunta al PHP y al navegador sólo le llega la lista. */
import { createHmac } from "node:crypto";
import { sesionValida } from "./lib/sesion.mjs";

// Lo único que esta función puede mirar
const ALBUMES = ["portadas", "carteles"];
const MINUTOS = 2;

export default async (req) => {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  if (!sesionValida(req)) return json({ error: "Sin autorización: entra por /interno/." }, 401);

  const secreto = process.env.MEDIA_SECRET;
  const endpoint = process.env.MEDIA_ENDPOINT;
  if (!secreto) return json({ error: "Falta la variable MEDIA_SECRET en Netlify." }, 500);
  if (!endpoint) return json({ error: "Falta la variable MEDIA_ENDPOINT en Netlify." }, 500);

  let cuerpo = {};
  try { cuerpo = await req.json(); } catch { /* cuerpo vacío */ }
  const album = ALBUMES.includes(cuerpo.album) ? cuerpo.album : null;
  if (!album) return json({ error: "Álbum no válido." }, 400);

  const exp = String(Math.floor(Date.now() / 1000) + MINUTOS * 60);
  const sig = createHmac("sha256", secreto).update(exp).digest("hex");

  const fd = new FormData();
  fd.append("accion", "listar");
  fd.append("album", album);
  fd.append("exp", exp);
  fd.append("sig", sig);

  let r;
  try {
    r = await fetch(endpoint, { method: "POST", body: fd });
  } catch {
    return json({ error: "No se pudo contactar con el servidor de medios." }, 502);
  }

  const data = await r.json().catch(() => null);
  if (!data) return json({ error: `El servidor de medios respondió ${r.status} sin datos.` }, 502);
  if (!r.ok) return json({ error: data.error || `El servidor respondió ${r.status}` }, r.status);

  return json({ album, archivos: data.archivos ?? [] });
};
