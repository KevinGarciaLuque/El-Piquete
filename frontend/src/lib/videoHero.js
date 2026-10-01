// Tamaños reales de cada archivo: respaldo para el anillo de carga si falta Content-Length.
export const FUENTES_HERO = {
  video: { url: '/cinematic/hero-scrub.mp4', bytes: 8011272 },
  movil: { url: '/cinematic/hero-scrub-portrait.mp4', bytes: 2781164 },
};
// Sin recibir datos durante este tiempo, la descarga se cancela y la portada queda con imágenes fijas.
const LIMITE_SIN_PROGRESO_MS = 20000;

const estados = new Map();
const suscriptores = new Map();

function estadoDe(fuente) {
  if (!estados.has(fuente.url)) estados.set(fuente.url, { fase: 'inactivo', progreso: 0, url: null });
  return estados.get(fuente.url);
}

function emitir(fuente, cambios) {
  const estado = { ...estadoDe(fuente), ...cambios };
  estados.set(fuente.url, estado);
  suscriptores.get(fuente.url)?.forEach((callback) => callback(estado));
}

export function suscribirVideoHero(fuente, callback) {
  if (!suscriptores.has(fuente.url)) suscriptores.set(fuente.url, new Set());
  suscriptores.get(fuente.url).add(callback);
  callback(estadoDe(fuente));
  return () => suscriptores.get(fuente.url).delete(callback);
}

// El video se descarga completo como Blob: algunos hostings no soportan peticiones
// parciales (Range) y sin ellas cada salto de tiempo vuelve al segundo cero.
// Cada archivo se descarga una sola vez por visita, aunque el hero se desmonte y vuelva.
export function cargarVideoHero(fuente) {
  if (estadoDe(fuente).fase !== 'inactivo') return;
  emitir(fuente, { fase: 'cargando' });
  descargar(fuente).catch(() => emitir(fuente, { fase: 'fallido' }));
}

async function descargar(fuente) {
  const control = new AbortController();
  let vigilante = setTimeout(() => control.abort(), LIMITE_SIN_PROGRESO_MS);

  try {
    const respuesta = await fetch(fuente.url, { priority: 'low', signal: control.signal });
    if (!respuesta.ok || !respuesta.body) throw new Error(`Video no disponible (${respuesta.status})`);

    const total = Number(respuesta.headers.get('Content-Length')) || fuente.bytes;
    const lector = respuesta.body.getReader();
    const partes = [];
    let recibidos = 0;
    let ultimoAviso = 0;

    for (;;) {
      const { done, value } = await lector.read();
      if (done) break;

      clearTimeout(vigilante);
      vigilante = setTimeout(() => control.abort(), LIMITE_SIN_PROGRESO_MS);

      partes.push(value);
      recibidos += value.length;

      const ahora = performance.now();
      if (ahora - ultimoAviso > 100) {
        ultimoAviso = ahora;
        emitir(fuente, { progreso: Math.min(1, recibidos / total) });
      }
    }

    emitir(fuente, { fase: 'listo', progreso: 1, url: URL.createObjectURL(new Blob(partes, { type: 'video/mp4' })) });
  } finally {
    clearTimeout(vigilante);
  }
}
