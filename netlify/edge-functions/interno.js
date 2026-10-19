/* Puerta única de /interno/.
   Va en el borde, antes de que Netlify sirva el archivo, así que no es un
   candado pintado en el navegador: sin contraseña la página no llega a salir
   del servidor. Cubre todo lo que cuelgue de /interno/, también lo que se
   añada más adelante.

   Al entrar se deja una galleta firmada; las funciones de Netlify la aceptan
   igual que la contraseña, para no tener que pedirla dos veces. */

const COOKIE = "interno";
const HORAS = 12;
const ETIQUETA = "interno";       // separador de dominio de la firma

/* Dos llaves distintas, con permisos distintos:
   «todo»    — LISTA_PASSWORD, entra en todo el área privada.
   «galeria» — GALERIA_PASSWORD, sólo ve lo ya publicado en el servidor; ni
               los creadores, ni los formularios, ni las fotos. */
const SOLO_GALERIA = "/interno/galeria/";

// Netlify Edge expone Netlify.env; en Deno y en Node se lee de otro sitio.
// Así la misma función se puede ejercitar fuera del borde.
export const entorno = (k) =>
  globalThis.Netlify?.env?.get?.(k) ??
  globalThis.Deno?.env?.get?.(k) ??
  globalThis.process?.env?.[k];

const texto = new TextEncoder();

export const firmar = async (mensaje, secreto) => {
  const llave = await crypto.subtle.importKey(
    "raw", texto.encode(secreto), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const firma = await crypto.subtle.sign("HMAC", llave, texto.encode(mensaje));
  return [...new Uint8Array(firma)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Comparación en tiempo constante para cadenas del mismo largo
export const iguales = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};

export const leerGalleta = (cabecera, nombre) => {
  for (const trozo of (cabecera || "").split(";")) {
    const corte = trozo.indexOf("=");
    if (corte < 0) continue;
    if (trozo.slice(0, corte).trim() === nombre) return trozo.slice(corte + 1).trim();
  }
  return null;
};

// ¿La galleta está bien firmada y sin caducar?
// La galleta lleva caducidad y papel, los dos firmados: «exp.papel.firma»
export const leerSesion = async (valor, secreto) => {
  if (!valor) return null;
  const trozos = valor.split(".");
  if (trozos.length !== 3) return null;
  const [exp, papel, firma] = trozos;
  if (!/^\d+$/.test(exp) || Number(exp) <= Math.floor(Date.now() / 1000)) return null;
  if (!/^[a-z]+$/.test(papel)) return null;
  if (!iguales(firma, await firmar(`${ETIQUETA}:${exp}:${papel}`, secreto))) return null;
  return { exp, papel };
};

export const nuevaGalleta = async (secreto, papel) => {
  const exp = String(Math.floor(Date.now() / 1000) + HORAS * 3600);
  const firma = await firmar(`${ETIQUETA}:${exp}:${papel}`, secreto);
  return `${COOKIE}=${exp}.${papel}.${firma}` +
    `; Path=/; Max-Age=${HORAS * 3600}; HttpOnly; Secure; SameSite=Lax`;
};

const pagina = (aviso, acción = "") => `<!doctype html>
<html lang="es"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Uso interno</title>
<style>
  :root{color-scheme:light}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fff;color:#15151a;
    font-family:"Mona Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    padding:28px}
  form{width:100%;max-width:360px}
  p.k{margin:0 0 6px;font-size:.72rem;font-weight:800;letter-spacing:.14em;
    text-transform:uppercase;color:#ce0306}
  h1{margin:0 0 20px;font-size:1.6rem;line-height:1.15}
  label{display:block;font-size:.7rem;font-weight:700;letter-spacing:.08em;
    text-transform:uppercase;color:#6d6d76;margin:0 0 6px}
  input{width:100%;font:inherit;padding:12px 14px;border:1px solid #e4e4e8;border-radius:10px;
    background:#fff;color:inherit}
  input:focus{outline:none;border-color:#ce0306}
  button{margin-top:12px;width:100%;border:0;border-radius:10px;padding:12px 18px;
    background:#ce0306;color:#fff;font:inherit;font-weight:700;cursor:pointer}
  .e{margin:12px 0 0;color:#ce0306;font-size:.82rem;font-weight:600}
</style></head>
<body>
  <form method="post"${acción ? ` action="${acción}"` : ""}>
    <p class="k">Uso interno</p>
    <h1>Contraseña</h1>
    <label for="c">Clave de acceso</label>
    <input id="c" type="password" name="clave" autocomplete="current-password" autofocus required />
    <button type="submit">Entrar</button>
    ${aviso ? `<p class="e">${aviso}</p>` : ""}
  </form>
</body></html>`;

const html = (cuerpo, status, extra = {}) => new Response(cuerpo, {
  status,
  headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", ...extra },
});

export default async (req, context) => {
  /* Se recortan los espacios: una clave pegada en Netlify con un salto de
     línea o un espacio al final es un clásico, y deja fuera a quien la escribe
     bien. Se recorta igual lo que llega del formulario, para que las dos
     partes se comparen en las mismas condiciones. */
  const clave = (entorno("LISTA_PASSWORD") ?? "").trim();
  const claveGaleria = (entorno("GALERIA_PASSWORD") ?? "").trim();
  const secreto = entorno("INTERNO_SECRET") ?? entorno("MEDIA_SECRET");

  if (!clave || !secreto) {
    return html(pagina("Falta LISTA_PASSWORD o MEDIA_SECRET en Netlify."), 500);
  }

  const url = new URL(req.url);

  /* Al salir, el navegador se queda en «…?salir», y el formulario de la clave
     se manda a esa misma dirección. Si «salir» se mirara también en el POST,
     se tragaría el intento de entrar y la contraseña no se comprobaría nunca:
     quien cerraba sesión ya no podía volver. Así que salir es cosa del GET. */
  const limpia = url.pathname;   // la ruta sin «?salir» colgando
  if (req.method !== "POST" && url.searchParams.has("salir")) {
    return html(pagina("Sesión cerrada.", limpia), 401, {
      "set-cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    });
  }

  const sesion = await leerSesion(leerGalleta(req.headers.get("cookie"), COOKIE), secreto);
  if (sesion) {
    // Quien entra con la llave de galería no sale de su página
    if (sesion.papel === "galeria" && url.pathname !== SOLO_GALERIA) {
      return new Response(null, { status: 303, headers: { location: SOLO_GALERIA, "cache-control": "no-store" } });
    }
    return context.next();
  }

  if (req.method === "POST") {
    const form = await req.formData().catch(() => null);
    const enviada = (form?.get("clave") ?? "").toString().trim();
    const papel = iguales(enviada, clave) ? "todo"
      : (claveGaleria && iguales(enviada, claveGaleria)) ? "galeria" : null;

    if (papel) {
      return new Response(null, {
        status: 303,
        headers: {
          // La llave de galería entra siempre por su página, venga de donde venga
          location: papel === "galeria" ? SOLO_GALERIA : limpia,
          "set-cookie": await nuevaGalleta(secreto, papel),
          "cache-control": "no-store",
        },
      });
    }
    await new Promise((r) => setTimeout(r, 700));  // frena la fuerza bruta
    /* Si la llave de galería ni siquiera está puesta, decirlo: si no, quien la
       usa se pasa la tarde pensando que la escribe mal. Sólo aparece cuando
       falta de verdad, así que a quien no debería estar aquí no le dice nada
       que no supiera ya. */
    return html(pagina(claveGaleria
      ? "Contraseña incorrecta."
      : "Contraseña incorrecta. (Ojo: GALERIA_PASSWORD no está configurada en Netlify, "
        + "así que la llave de sólo mirar no puede funcionar todavía.)", limpia), 401);
  }

  return html(pagina("", limpia), 401);
};
