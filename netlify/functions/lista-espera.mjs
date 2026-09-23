// Lee los formularios enviados desde la API de Netlify.
// Corre en el servidor: ni el token ni la contraseña llegan nunca al navegador.
import { timingSafeEqual } from "node:crypto";

const API = "https://api.netlify.com/api/v1";

// Comparación en tiempo constante: evita adivinar la clave midiendo cuánto tarda en fallar.
const claveValida = (recibida, esperada) => {
  if (typeof recibida !== "string" || !esperada) return false;
  const a = Buffer.from(recibida);
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
};

const pedir = async (ruta, token) => {
  const r = await fetch(`${API}${ruta}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`Netlify respondió ${r.status} en ${ruta}`);
  return r.json();
};

export default async (req, context) => {
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const token = process.env.ACCESS_LIST;
  const clave = process.env.LISTA_PASSWORD;
  // Netlify expone el id del sitio por dos vías; se prueban ambas.
  const siteId = context?.site?.id ?? process.env.SITE_ID;

  if (!token) return json({ error: "Falta la variable ACCESS_LIST en Netlify." }, 500);
  if (!clave) return json({ error: "Falta la variable LISTA_PASSWORD en Netlify." }, 500);
  if (!siteId) return json({ error: "Netlify no ha facilitado SITE_ID." }, 500);

  let cuerpo = {};
  try { cuerpo = await req.json(); } catch { /* cuerpo vacío o mal formado */ }

  if (!claveValida(cuerpo.clave, clave)) {
    await new Promise((r) => setTimeout(r, 700)); // frena los intentos por fuerza bruta
    return json({ error: "Contraseña incorrecta." }, 401);
  }

  try {
    const formularios = await pedir(`/sites/${siteId}/forms`, token);
    const resumen = formularios.map((f) => ({ id: f.id, name: f.name, count: f.submission_count }));

    // «Todos»: se juntan los envíos de cada formulario y se ordenan por fecha
    if (cuerpo.formulario === "__todos") {
      const juntos = [];
      for (const f of formularios) {
        for (let pagina = 1; pagina <= 3; pagina++) {
          const lote = await pedir(`/forms/${f.id}/submissions?per_page=100&page=${pagina}`, token);
          juntos.push(...lote.map((e) => ({ ...e, _form: f.name })));
          if (lote.length < 100) break;
        }
      }
      juntos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return json({
        formularios: resumen,
        actual: "__todos",
        envios: juntos.map((e) => ({ fecha: e.created_at, formulario: e._form, datos: e.data ?? {} })),
      });
    }

    const elegido = cuerpo.formulario
      ? formularios.find((f) => f.name === cuerpo.formulario)
      : formularios.find((f) => f.name === "lista-espera-online") ?? formularios[0];

    if (!elegido) return json({ formularios: resumen, envios: [], aviso: "Aún no hay formularios registrados." });

    // La API pagina de 100 en 100
    const envios = [];
    for (let pagina = 1; pagina <= 20; pagina++) {
      const lote = await pedir(`/forms/${elegido.id}/submissions?per_page=100&page=${pagina}`, token);
      envios.push(...lote);
      if (lote.length < 100) break;
    }

    return json({
      formularios: resumen,
      actual: elegido.name,
      envios: envios.map((e) => ({ fecha: e.created_at, datos: e.data ?? {} })),
    });
  } catch (e) {
    return json({ error: `No se han podido leer los envíos: ${e.message}` }, 502);
  }
};
