// Genera dist/sitemap.xml con enlaces hreflang ES/IT a partir de las rutas reales del build.
import fs from "node:fs";
import path from "node:path";

const SITE = "https://evelynlanegra.com";
const DIST = "dist";

function routes(dir, base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...routes(path.join(dir, e.name), `${base}/${e.name}`));
    else if (e.name === "index.html") out.push(base === "" ? "/" : `${base}/`);
  }
  return out;
}

const all = routes(DIST).filter((r) => !r.includes("/404")).sort();
const set = new Set(all);
const canonical = (r) => (r === "/it/" ? "/" : r.replace(/^\/it\//, "/"));

const urls = all
  .map((r) => {
    const can = canonical(r);
    const es = can;
    const it = can === "/" ? "/it/" : "/it" + can;
    const hasPair = set.has(es) && set.has(it);
    const alts = hasPair
      ? [
          `    <xhtml:link rel="alternate" hreflang="es" href="${SITE}${es}"/>`,
          `    <xhtml:link rel="alternate" hreflang="it" href="${SITE}${it}"/>`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${es}"/>`,
        ].join("\n")
      : "";
    return `  <url>\n    <loc>${SITE}${r}</loc>\n${alts}${alts ? "\n" : ""}  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml);
console.log(`sitemap.xml generado con ${all.length} URLs`);
