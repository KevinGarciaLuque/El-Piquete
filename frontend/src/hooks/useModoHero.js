import { useSyncExternalStore } from 'react';

// Portada fija: reducir movimiento, y teléfonos acostados (no hay alto para la película).
const CONSULTAS_FIJA = [
  '(prefers-reduced-motion: reduce)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
];

// Pantallas verticales o angostas: película vertical con el texto debajo.
const CONSULTAS_VERTICAL = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
];

// Referenciadas a nivel de módulo: los MediaQueryList sin referencia han perdido
// sus listeners en navegadores antiguos.
const crear = (lista) =>
  typeof window !== 'undefined' && window.matchMedia ? lista.map((consulta) => window.matchMedia(consulta)) : [];
const consultasFija = crear(CONSULTAS_FIJA);
const consultasVertical = crear(CONSULTAS_VERTICAL);
const todas = [...consultasFija, ...consultasVertical];

function ahorroDeDatosActivo() {
  return typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData);
}

function suscribir(callback) {
  todas.forEach((consulta) => consulta.addEventListener('change', callback));
  return () => todas.forEach((consulta) => consulta.removeEventListener('change', callback));
}

function obtenerModo() {
  if (!todas.length) return 'estatico';
  if (ahorroDeDatosActivo() || consultasFija.some((consulta) => consulta.matches)) return 'estatico';
  return consultasVertical.some((consulta) => consulta.matches) ? 'movil' : 'video';
}

// Devuelve 'video' (escritorio), 'movil' (película vertical) o 'estatico'. Se reevalúa
// en vivo: rotar el dispositivo, redimensionar o activar "reducir movimiento" cambia el modo.
export default function useModoHero() {
  return useSyncExternalStore(suscribir, obtenerModo, () => 'estatico');
}
