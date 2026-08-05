const pool = require('../config/db');

function agruparVariantes(filas) {
  const productos = new Map();

  for (const fila of filas) {
    if (!productos.has(fila.id)) {
      productos.set(fila.id, {
        id: fila.id,
        nombre: fila.nombre,
        slug: fila.slug,
        descripcion: fila.descripcion,
        ingredientes: fila.ingredientes,
        nivel_picante: fila.nivel_picante,
        tipo: fila.tipo,
        imagen_url: fila.imagen_url,
        destacado: !!fila.destacado,
        mas_vendido: !!fila.mas_vendido,
        variantes: [],
      });
    }

    if (fila.variante_id) {
      productos.get(fila.id).variantes.push({
        id: fila.variante_id,
        presentacion: fila.presentacion,
        contenido_neto: fila.contenido_neto,
        precio: fila.precio,
        sku: fila.sku,
        cantidad_disponible: fila.cantidad_disponible,
      });
    }
  }

  return Array.from(productos.values());
}

const PRODUCTOS_QUERY = `
  SELECT
    p.id, p.nombre, p.slug, p.descripcion, p.ingredientes, p.nivel_picante,
    p.tipo, p.imagen_url, p.destacado, p.mas_vendido,
    v.id AS variante_id, v.presentacion, v.contenido_neto, v.precio, v.sku,
    i.cantidad_disponible
  FROM productos p
  LEFT JOIN variantes_producto v ON v.producto_id = p.id AND v.activo = TRUE
  LEFT JOIN inventario i ON i.variante_id = v.id
  WHERE p.activo = TRUE
`;

async function listarProductos(req, res, next) {
  try {
    const [filas] = await pool.query(`${PRODUCTOS_QUERY} ORDER BY p.id`);
    res.json(agruparVariantes(filas));
  } catch (error) {
    next(error);
  }
}

async function obtenerProductoPorSlug(req, res, next) {
  try {
    const [filas] = await pool.query(`${PRODUCTOS_QUERY} AND p.slug = ?`, [req.params.slug]);

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(agruparVariantes(filas)[0]);
  } catch (error) {
    next(error);
  }
}

module.exports = { listarProductos, obtenerProductoPorSlug };
