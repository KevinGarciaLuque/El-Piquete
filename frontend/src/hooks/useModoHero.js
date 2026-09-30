import { useSyncExternalStore } from 'react';

// Casos en que la portada se muestra como imagen fija en lugar del video con scroll.
export const CONSULTAS_PORTADA_ESTATICA = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
];

// Referenciadas a nivel de módulo: los MediaQueryList sin referencia han perdido
// sus listeners en navegadores antiguos.
const consultas =
  typeof window !== 'undefined' && window.matchMedia
    ? CONSULTAS_PORTADA_ESTATICA.map((consulta) => window.matchMedia(consulta))
    : [];

function ahorroDeDatosActivo() {
  return typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData);
}

function suscribir(callback) {
  consultas.forEach((consulta) => consulta.addEventListener('change', callback));
  return () => consultas.forEach((consulta) => consulta.removeEventListener('change', callback));
}

function obtenerModo() {
  if (!consultas.length) return 'estatico';
  return ahorroDeDatosActivo() || consultas.some((consulta) => consulta.matches) ? 'estatico' : 'video';
}

// Se reevalúa en vivo: rotar el dispositivo, redimensionar la ventana o activar
// "reducir movimiento" cambia el modo sin recargar la página.
export default function useModoHero() {
  return useSyncExternalStore(suscribir, obtenerModo, () => 'estatico');
}
