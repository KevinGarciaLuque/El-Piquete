import { urlImagen } from './media';

// Curva de salida única para todas las animaciones de la tienda.
export const EASE_EP = [0.22, 1, 0.36, 1];

export const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

export const NIVELES_PICANTE = {
  suave: { etiqueta: 'Suave', intensidad: 1 },
  tradicional: { etiqueta: 'Tradicional', intensidad: 2 },
  picante: { etiqueta: 'Picante', intensidad: 3 },
  extra_picante: { etiqueta: 'Extra picante', intensidad: 3 },
};

export const ORDEN_NIVELES = ['suave', 'tradicional', 'picante', 'extra_picante'];

// Imágenes de referencia mientras el producto no tenga foto propia subida desde el admin.
const IMAGEN_POR_NIVEL = {
  suave: '/media/P1-suave.webp',
  tradicional: '/media/P2-tradicional.webp',
  picante: '/media/P3-picante.webp',
  extra_picante: '/media/P3-picante.webp',
};

const IMAGEN_POR_COMBO = {
  'combo-para-probar': '/media/C1-probar.webp',
  'combo-familiar': '/media/C2-familiar.webp',
  'combo-negocio': '/media/C3-negocio.webp',
};

export function imagenProducto(producto) {
  return (
    urlImagen(producto.imagen_url) ||
    IMAGEN_POR_COMBO[producto.slug] ||
    IMAGEN_POR_NIVEL[producto.nivel_picante] ||
    IMAGEN_POR_NIVEL.tradicional
  );
}

export function tieneFotoPropia(producto) {
  return Boolean(producto.imagen_url);
}
