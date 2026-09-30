export const VIDEO_HERO_URL = '/cinematic/hero-scrub.mp4';
// Tamaño real del archivo: respaldo para la barra de carga si el servidor no envía Content-Length.
const VIDEO_HERO_BYTES = 8011272;
// Sin recibir datos durante este tiempo, la descarga se cancela y la portada queda con imágenes fijas.
const LIMITE_SIN_PROGRESO_MS = 20000;

let estado = { fase: 'inactivo', progreso: 0, url: null };
const suscriptores = new Set();

function emitir(cambios) {
  estado = { ...estado, ...cambios };
  suscriptores.forEach((callback) => callback(estado));
}

export function suscribirVideoHero(callback) {
  suscriptores.add(callback);
  callback(estado);
  return () => suscriptores.delete(callback);
}

// El video se descarga completo como Blob: algunos hostings no soportan peticiones
// parciales (Range) y sin ellas cada salto de tiempo vuelve al segundo cero.
// La descarga vive a nivel de módulo para no repetirse si el hero se desmonta y vuelve.
export function cargarVideoHero() {
  if (estado.fase !== 'inactivo') return;
  emitir({ fase: 'cargando' });
  descargar().catch(() => emitir({ fase: 'fallido' }));
}

async function descargar() {
  const control = new AbortController();
  let vigilante = setTimeout(() => control.abort(), LIMITE_SIN_PROGRESO_MS);

  try {
    const respuesta = await fetch(VIDEO_HERO_URL, { priority: 'low', signal: control.signal });
    if (!respuesta.ok || !respuesta.body) throw new Error(`Video no disponible (${respuesta.status})`);

    const total = Number(respuesta.headers.get('Content-Length')) || VIDEO_HERO_BYTES;
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
        emitir({ progreso: Math.min(1, recibidos / total) });
      }
    }

    emitir({ fase: 'listo', progreso: 1, url: URL.createObjectURL(new Blob(partes, { type: 'video/mp4' })) });
  } finally {
    clearTimeout(vigilante);
  }
}
