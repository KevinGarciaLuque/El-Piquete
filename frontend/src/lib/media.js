const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

export function urlImagen(rutaRelativa) {
  if (!rutaRelativa) return null;
  return `${API_ORIGIN}${rutaRelativa}`;
}
