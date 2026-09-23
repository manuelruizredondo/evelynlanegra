# Subida de fotos y vídeos — qué hay que hacer en el servidor

El navegador manda los archivos **directamente a IONOS**, sin pasar por Netlify,
porque sus funciones no aceptan más de 6 MB por petición y un vídeo pesa más.

## 1. Subir por SFTP a media.lanegrasalsa.com

Dentro de la carpeta `media/evelyn/`:

| Archivo de aquí      | Cómo se llama allí     | Dónde va                |
|----------------------|------------------------|-------------------------|
| `lanegra-media.php`  | `lanegra-media.php`    | `media/evelyn/`         |
| `user.ini`           | `.user.ini`            | `media/evelyn/`         |
| `subidas.htaccess`   | `.htaccess`            | `media/evelyn/subidas/` |

La carpeta `media/evelyn/subidas/` se crea sola al primer uso, pero conviene crearla a
mano para poder dejar dentro el `.htaccess` desde el principio.

## 2. Inventar un secreto

Una cadena larga y aleatoria. Por ejemplo, en la terminal:

    openssl rand -hex 32

Ese valor va en **dos sitios y tiene que ser idéntico**:

- En `lanegra-media.php`, en la constante `SECRETO`
- En Netlify, en la variable `MEDIA_SECRET`

## 3. Revisar las cuatro líneas de configuración del PHP

```php
const SECRETO  = '...';                                          // el del paso 2
const CARPETA  = __DIR__ . '/subidas';                           // dónde se guardan
const URL_BASE = 'https://media.lanegrasalsa.com/media/evelyn/subidas'; // cómo se ven
const ORIGEN   = 'https://evelynlanegra.com';                    // quién puede llamar
```

`URL_BASE` debe coincidir con la dirección pública real de esa carpeta. Para
comprobarlo: sube una foto por SFTP y ábrela en el navegador.

## 4. Variables en Netlify

`Site configuration → Environment variables`

| Nombre           | Valor                                                       |
|------------------|-------------------------------------------------------------|
| `MEDIA_SECRET`   | el secreto del paso 2                                       |
| `MEDIA_ENDPOINT` | `https://media.lanegrasalsa.com/media/evelyn/lanegra-media.php` |

Después, **Deploys → Trigger deploy**: las variables se leen al desplegar.

## Cómo está protegido

- El secreto **nunca baja al navegador**. Netlify comprueba la contraseña y firma
  un permiso que caduca a los 20 minutos; el PHP recalcula la firma y compara.
- Solo se aceptan peticiones desde evelynlanegra.com.
- Solo fotos y vídeos: se comprueba la extensión **y el contenido real**, así que
  un `.php` renombrado a `.jpg` no entra.
- El `.htaccess` apaga PHP en la carpeta de subidas: aunque algo se colara, el
  servidor lo serviría como texto en vez de ejecutarlo.
- Los nombres se limpian (sin tildes, sin rutas, sin dobles extensiones) y nunca
  se sobrescribe: si el nombre existe, se añade un número.
