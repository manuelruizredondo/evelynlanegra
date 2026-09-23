<?php
declare(strict_types=1);
/**
 * Receptor de fotos y vídeos para el área privada de evelynlanegra.com
 *
 * Se sube por FTP junto a la carpeta de medios. El navegador le manda los
 * archivos directamente, así que no le afecta el límite de 6 MB de Netlify.
 *
 * No guarda contraseñas: Netlify firma un permiso que caduca y aquí se verifica.
 */

// El secreto vive en «secreto.php», que se sube por SFTP y nunca entra en git.
// Así no puede acabar publicado por descuido en el repositorio.
$SECRETO = @include __DIR__ . '/secreto.php';

const ORIGEN = 'https://evelynlanegra.com';   // quién puede llamar
const CARPETA = __DIR__ . '/subidas';

// La dirección pública se deduce sola: da igual en qué carpeta se suba
function urlBase(): string {
  $esquema = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
  $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
  $dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
  return $esquema . '://' . $host . $dir . '/subidas';
}

const MAX_BYTES = 314572800; // 300 MB
const TIPOS = [
  'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
  'webp' => 'image/webp', 'gif' => 'image/gif', 'avif' => 'image/avif',
  'mp4' => 'video/mp4', 'webm' => 'video/webm', 'mov' => 'video/quicktime',
];

header('Access-Control-Allow-Origin: ' . ORIGEN);
header('Access-Control-Allow-Headers: content-type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

function salir(int $codigo, array $datos): never {
  http_response_code($codigo);
  echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') salir(405, ['error' => 'Método no permitido']);

/* ── Permiso: Netlify firma una caducidad; aquí se recalcula y se compara ── */
$exp = (string)($_POST['exp'] ?? '');
$sig = (string)($_POST['sig'] ?? '');
if ($exp === '' || $sig === '') salir(401, ['error' => 'Falta el permiso de subida.']);
if (!ctype_digit($exp) || (int)$exp < time()) salir(401, ['error' => 'El permiso ha caducado. Vuelve a entrar.']);
if (!is_string($SECRETO) || strlen($SECRETO) < 20) salir(500, ['error' => 'Falta secreto.php en el servidor.']);
if (!hash_equals(hash_hmac('sha256', $exp, $SECRETO), $sig)) salir(401, ['error' => 'Permiso no válido.']);

if (!is_dir(CARPETA) && !mkdir(CARPETA, 0755, true)) salir(500, ['error' => 'No se pudo crear la carpeta de subidas.']);

/* ── Deja el nombre en algo seguro: sin rutas, sin tildes, sin dobles extensiones ── */
function nombreSeguro(string $original, string $ext): string {
  $base = pathinfo(basename($original), PATHINFO_FILENAME);
  $base = strtr($base, ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ñ'=>'n','ü'=>'u',
                        'Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ú'=>'u','Ñ'=>'n','Ü'=>'u']);
  $base = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $base) ?? '');
  $base = trim($base, '-');
  if ($base === '') $base = 'archivo';
  return substr($base, 0, 60) . '.' . $ext;
}

function ficha(string $ruta): array {
  $nombre = basename($ruta);
  $ext = strtolower(pathinfo($nombre, PATHINFO_EXTENSION));
  return [
    'nombre' => $nombre,
    'url'    => urlBase() . '/' . rawurlencode($nombre),
    'bytes'  => filesize($ruta) ?: 0,
    'fecha'  => date('c', filemtime($ruta) ?: time()),
    'tipo'   => str_starts_with(TIPOS[$ext] ?? '', 'video') ? 'video' : 'imagen',
  ];
}

function listado(): array {
  $salida = [];
  foreach (glob(CARPETA . '/*') ?: [] as $ruta) {
    if (!is_file($ruta)) continue;
    $ext = strtolower(pathinfo($ruta, PATHINFO_EXTENSION));
    if (!isset(TIPOS[$ext])) continue;
    $salida[] = ficha($ruta);
  }
  usort($salida, fn($a, $b) => strcmp($b['fecha'], $a['fecha']));
  return $salida;
}

$accion = (string)($_POST['accion'] ?? 'listar');

if ($accion === 'listar') salir(200, ['archivos' => listado()]);

if ($accion === 'borrar') {
  $nombre = basename((string)($_POST['nombre'] ?? ''));
  $ext = strtolower(pathinfo($nombre, PATHINFO_EXTENSION));
  if ($nombre === '' || !isset(TIPOS[$ext])) salir(400, ['error' => 'Nombre no válido.']);
  $ruta = CARPETA . '/' . $nombre;
  if (!is_file($ruta)) salir(404, ['error' => 'Ese archivo ya no está.']);
  if (!unlink($ruta)) salir(500, ['error' => 'No se pudo borrar.']);
  salir(200, ['ok' => true, 'archivos' => listado()]);
}

if ($accion === 'subir') {
  $f = $_FILES['archivo'] ?? null;
  if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $motivo = match ((int)($f['error'] ?? 4)) {
      UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'El archivo supera el límite del servidor.',
      UPLOAD_ERR_PARTIAL => 'La subida se cortó a medias.',
      default => 'No llegó ningún archivo.',
    };
    salir(400, ['error' => $motivo]);
  }
  if ($f['size'] > MAX_BYTES) salir(413, ['error' => 'Máximo 300 MB por archivo.']);

  $ext = strtolower(pathinfo((string)$f['name'], PATHINFO_EXTENSION));
  if (!isset(TIPOS[$ext])) salir(415, ['error' => 'Solo se admiten fotos y vídeos.']);

  // El contenido real tiene que coincidir con la extensión: un .php renombrado no pasa
  $real = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']) ?: '';
  $familia = explode('/', TIPOS[$ext])[0];
  if (!str_starts_with($real, $familia . '/')) salir(415, ['error' => 'El contenido no es una foto ni un vídeo.']);

  $nombre = nombreSeguro((string)$f['name'], $ext);
  $destino = CARPETA . '/' . $nombre;
  for ($i = 2; file_exists($destino); $i++) {
    $nombre = nombreSeguro((string)$f['name'], $ext);
    $nombre = substr($nombre, 0, -strlen($ext) - 1) . '-' . $i . '.' . $ext;
    $destino = CARPETA . '/' . $nombre;
  }

  if (!move_uploaded_file($f['tmp_name'], $destino)) salir(500, ['error' => 'No se pudo guardar el archivo.']);
  @chmod($destino, 0644);
  salir(200, ['ok' => true, 'archivo' => ficha($destino)]);
}

salir(400, ['error' => 'Acción desconocida.']);
