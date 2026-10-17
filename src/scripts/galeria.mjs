/* Guardado y consulta de lo generado, contra el servidor de medios.
   Lo comparten el creador de portadas y el generador de carteles: cada uno
   usa su propio álbum, pero el permiso, la subida, el listado, el filtro y el
   visor son los mismos. */

export const bonito = (b) => b > 1048576 ? (b / 1048576).toFixed(1) + " MB"
                                         : Math.max(1, Math.round(b / 1024)) + " KB";

/* Descarga en tanda.
   El atributo «download» de un enlace lo ignora el navegador cuando el
   archivo es de otro dominio, y el servidor de medios lo es: pulsar
   «Descargar» en un vídeo lo abría en vez de guardarlo. Así que hay que
   traerse cada archivo y soltarlo como blob, que ya es del mismo origen.

   Van de uno en uno a propósito: una tanda de portadas en vídeo pasa de los
   200 MB y bajarlas todas a la vez se come la memoria del navegador. */
export async function bajarEnTanda(piezas, { alAvanzar, seguir = () => true } = {}) {
  let hechas = 0;
  for (const a of piezas) {
    if (!seguir()) break;
    alAvanzar?.(hechas, piezas.length, a);
    const r = await fetch(a.url, { cache: "no-store" });
    if (!r.ok) throw new Error(`${a.nombre}: el servidor respondió ${r.status}`);
    const url = URL.createObjectURL(await r.blob());
    const el = document.createElement("a");
    el.href = url; el.download = a.nombre; el.click();
    // Un respiro antes de soltar el objeto: si se revoca de inmediato, el
    // navegador se queda a medias con los archivos grandes
    await new Promise((listo) => setTimeout(listo, 500));
    URL.revokeObjectURL(url);
    hechas++;
  }
  alAvanzar?.(hechas, piezas.length, null);
  return hechas;
}

/* «soloLectura» cambia de dónde salen los datos: en vez de pedir un permiso
   de subida —que vale igual para subir y para borrar— se llama a una función
   de Netlify que pregunta por nosotros y devuelve sólo la lista. */
export function crearGaleria({ album, nodos, alRehacer, soloLectura = false }) {
  const { rejilla, cuenta, filtro, visor, visorCaja, bajarTodo } = nodos;
  let permiso = null;
  let enServidor = [];
  let tipoVisible = "";
  // Lo que se ve ahora mismo, que es lo que se baja en tanda
  let visibles = [];

  /* ── Permiso y llamadas ── */
  const permisoVigente = async () => {
    const ahora = Math.floor(Date.now() / 1000);
    if (!permiso || Number(permiso.exp) - ahora < 60) {
      const r = await fetch("/.netlify/functions/media-permiso", {
        method: "POST", headers: { "content-type": "application/json" },
        body: "{}", credentials: "same-origin",
      });
      const data = await r.json().catch(() => null);
      if (!data) throw new Error(r.status === 404
        ? "Las funciones de Netlify no están disponibles aquí."
        : `El servidor respondió ${r.status} sin datos.`);
      if (!r.ok) throw new Error(data.error || "Error inesperado");
      permiso = data;
    }
    return permiso;
  };

  const pedir = async (accion, extra = {}) => {
    const p = await permisoVigente();
    const fd = new FormData();
    fd.append("accion", accion);
    fd.append("album", album);
    fd.append("exp", p.exp);
    fd.append("sig", p.sig);
    for (const [k, v] of Object.entries(extra)) fd.append(k, v);
    const r = await fetch(p.endpoint, { method: "POST", body: fd });
    const data = await r.json().catch(() => null);
    if (!data) throw new Error(`${p.endpoint} respondió ${r.status} sin datos.`);
    if (!r.ok) throw new Error(data.error || `El servidor respondió ${r.status}`);
    return data;
  };

  /* ── Subir: la pieza y, al lado, un .json con cómo se hizo ── */
  const subir = async (blob, nombre, ajustes) => {
    if (soloLectura) throw new Error("Esta vista es de sólo lectura.");
    const subida = await pedir("subir", { archivo: new File([blob], nombre, { type: blob.type }) });
    const guardado = subida.archivo?.nombre ?? nombre;
    if (ajustes) {
      const raiz = guardado.replace(/\.[^.]+$/, "");
      const texto = JSON.stringify({ ...ajustes, archivo: guardado }, null, 1);
      await pedir("subir", {
        archivo: new File([texto], `${raiz}.json`, { type: "application/json" }),
      });
    }
    return guardado;
  };

  /* ── Visor ── */
  const cerrarVisor = () => { visor.hidden = true; visorCaja.innerHTML = ""; };
  visor.addEventListener("click", (ev) => {
    if (ev.target === visor || ev.target.closest("[data-cerrar]")) cerrarVisor();
  });
  addEventListener("keydown", (ev) => { if (ev.key === "Escape" && !visor.hidden) cerrarVisor(); });

  const abrirVisor = (a) => {
    visorCaja.innerHTML = a.tipo === "video"
      ? `<video src="${a.url}" controls autoplay loop playsinline></video>`
      : `<img src="${a.url}" alt="" />`;
    visor.hidden = false;
  };

  /* ── Listado ── */
  const pintar = () => {
    const ajustes = new Map(enServidor.filter((a) => a.tipo === "ajustes")
      .map((a) => [a.nombre.replace(/\.json$/, ""), a]));
    const todas = enServidor.filter((a) => a.tipo !== "ajustes");
    const imagenes = todas.filter((a) => a.tipo === "imagen").length;
    const videos = todas.filter((a) => a.tipo === "video").length;
    const piezas = tipoVisible ? todas.filter((a) => a.tipo === tipoVisible) : todas;
    visibles = piezas;
    if (bajarTodo) {
      bajarTodo.hidden = piezas.length === 0;
      bajarTodo.textContent = `Descargar ${piezas.length === 1 ? "la que se ve" : `las ${piezas.length} que se ven`}`;
    }

    cuenta.textContent = todas.length
      ? `${imagenes} ${imagenes === 1 ? "imagen" : "imágenes"} · ${videos} ${videos === 1 ? "vídeo" : "vídeos"}`
      : "Todavía no hay nada guardado.";

    rejilla.innerHTML = "";
    for (const a of piezas) {
      const caja = document.createElement("div");
      caja.className = "ge__ficha";
      caja.innerHTML = `
        ${a.tipo === "video"
          // El «#t=1» obliga a enseñar un fotograma: sin él sale en negro
          ? `<video class="ge__lienzo" src="${a.url}#t=1" preload="metadata" muted loop playsinline></video>`
          : `<img class="ge__lienzo" src="${a.url}" alt="" loading="lazy" />`}
        <div class="ge__pie">
          <p class="ge__t"></p>
          <p class="ge__sub"></p>
          <div class="ge__acciones">
            <button type="button" class="ge__a" data-abrir>Ver</button>
            <button type="button" class="ge__a" data-bajar>Descargar</button>
          </div>
        </div>`;
      caja.querySelector(".ge__t").textContent = a.nombre;
      caja.querySelector(".ge__sub").textContent =
        `${a.tipo === "video" ? "Vídeo" : "Imagen"} · ${bonito(a.bytes)} · ` +
        new Date(a.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
      caja.querySelector("[data-abrir]").addEventListener("click", () => abrirVisor(a));
      caja.querySelector(".ge__lienzo").addEventListener("click", () => abrirVisor(a));
      // Por el mismo motivo que la tanda: con un enlace a otro dominio el
      // navegador abre el archivo en vez de guardarlo
      caja.querySelector("[data-bajar]").addEventListener("click", async (ev) => {
        const b = ev.currentTarget;
        b.disabled = true; b.textContent = "Bajando…";
        try { await bajarEnTanda([a]); } catch (e) { cuenta.textContent = e.message; }
        b.disabled = false; b.textContent = "Descargar";
      });

      const conAjustes = ajustes.get(a.nombre.replace(/\.[^.]+$/, ""));
      if (conAjustes && alRehacer) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "ge__a"; b.textContent = "Rehacer";
        b.addEventListener("click", async () => {
          b.disabled = true;
          try {
            const r = await fetch(conAjustes.url, { cache: "no-store" });
            await alRehacer(await r.json(), a);
          } finally { b.disabled = false; }
        });
        caja.querySelector(".ge__acciones").append(b);
      }
      rejilla.append(caja);
    }
  };

  const listarDeLejos = async () => {
    const r = await fetch("/.netlify/functions/galeria", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ album }), credentials: "same-origin",
    });
    const data = await r.json().catch(() => null);
    if (!data) throw new Error(r.status === 404
      ? "Las funciones de Netlify no están disponibles aquí."
      : `El servidor respondió ${r.status} sin datos.`);
    if (!r.ok) throw new Error(data.error || "Error inesperado");
    return data;
  };

  const listar = async () => {
    try {
      const data = soloLectura ? await listarDeLejos() : await pedir("listar");
      enServidor = data.archivos ?? [];
    } catch (e) {
      cuenta.textContent = e.message;
      return;
    }
    pintar();
  };

  if (filtro) {
    filtro.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-ver-tipo]");
      if (!b) return;
      tipoVisible = b.dataset.verTipo;
      filtro.querySelectorAll("[data-ver-tipo]").forEach((x) =>
        x.classList.toggle("ge__f--on", x === b));
      pintar();
    });
  }

  /* El botón baja lo que el filtro deja a la vista, así que «Vídeos» +
     «Descargar» es la forma de llevarse sólo los vídeos. */
  if (bajarTodo) {
    let bajando = false, parar = false;
    bajarTodo.hidden = true;
    bajarTodo.addEventListener("click", async () => {
      if (bajando) { parar = true; bajarTodo.textContent = "Parando…"; return; }
      bajando = true; parar = false;
      const vuelta = [...visibles];
      try {
        await bajarEnTanda(vuelta, {
          seguir: () => !parar,
          alAvanzar: (hechas, total) => {
            bajarTodo.textContent = hechas < total
              ? `Bajando ${hechas + 1} de ${total} · parar`
              : `Listo: ${hechas} de ${total}`;
          },
        });
      } catch (e) {
        cuenta.textContent = e.message;
      }
      bajando = false;
      setTimeout(pintar, 1600);
    });
  }

  return { subir, listar, pintar, abrirVisor };
}
