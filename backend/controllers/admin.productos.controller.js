const pool = require('../config/db');
const slugify = require('../utils/slugify');

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function generarSlugUnico(nombre) {
  const base = slugify(nombre);
  let slug = base;
  let sufijo = 2;

  while (true) {
    const [[existente]] = await pool.query('SELECT id FROM productos WHERE slug = ?', [slug]);
    if (!existente) return slug;
    slug = `${base}-${sufijo}`;
    sufijo += 1;
  }
}

async function listarProductosAdmin(req, res, next) {
  try {
    const [productos] = await pool.query('SELECT * FROM productos ORDER BY id DESC');
    const [variantes] = await pool.query(
      `SELECT v.*, i.cantidad_disponible
       FROM variantes_producto v
       LEFT JOIN inventario i ON i.variante_id = v.id`,
    );

    const variantesPorProducto = new Map();
    for (const variante of variantes) {
      const lista = variantesPorProducto.get(variante.producto_id) || [];
      lista.push(variante);
      variantesPorProducto.set(variante.producto_id, lista);
    }

    res.json(productos.map((producto) => ({ ...producto, variantes: variantesPorProducto.get(producto.id) || [] })));
  } catch (error) {
    next(error);
  }
}

async function obtenerProductoAdmin(req, res, next) {
  try {
    const [[producto]] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const [variantes] = await pool.query(
      `SELECT v.*, i.cantidad_disponible
       FROM variantes_producto v
       LEFT JOIN inventario i ON i.variante_id = v.id
       WHERE v.producto_id = ?`,
      [producto.id],
    );

    res.json({ ...producto, variantes });
  } catch (error) {
    next(error);
  }
}

async function crearProducto(req, res, next) {
  try {
    const { nombre, descripcion, ingredientes, nivel_picante, tipo, destacado, mas_vendido, activo } = req.body;

    if (!nombre) return next(errorHttp(400, 'El nombre es obligatorio'));

    const slug = await generarSlugUnico(nombre);

    const [resultado] = await pool.query(
      `INSERT INTO productos (nombre, slug, descripcion, ingredientes, nivel_picante, tipo, destacado, mas_vendido, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        slug,
        descripcion || null,
        ingredientes || null,
        nivel_picante || 'tradicional',
        tipo || 'individual',
        Boolean(destacado),
        Boolean(mas_vendido),
        activo === undefined ? true : Boolean(activo),
      ],
    );

    res.status(201).json({ id: resultado.insertId, slug });
  } catch (error) {
    next(error);
  }
}

async function actualizarProducto(req, res, next) {
  try {
    const campos = ['nombre', 'descripcion', 'ingredientes', 'nivel_picante', 'tipo', 'destacado', 'mas_vendido', 'activo', 'imagen_url'];
    const actualizaciones = [];
    const valores = [];

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        actualizaciones.push(`${campo} = ?`);
        valores.push(req.body[campo]);
      }
    }

    if (actualizaciones.length === 0) {
      return next(errorHttp(400, 'No hay campos para actualizar'));
    }

    valores.push(req.params.id);
    const [resultado] = await pool.query(`UPDATE productos SET ${actualizaciones.join(', ')} WHERE id = ?`, valores);

    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado' });
  } catch (error) {
    next(error);
  }
}

async function eliminarProducto(req, res, next) {
  try {
    const [resultado] = await pool.query('UPDATE productos SET activo = FALSE WHERE id = ?', [req.params.id]);
    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto desactivado' });
  } catch (error) {
    next(error);
  }
}

async function subirImagenProducto(req, res, next) {
  try {
    if (!req.file) return next(errorHttp(400, 'No se recibió ninguna imagen'));

    const imagenUrl = `/uploads/productos/${req.file.filename}`;
    await pool.query('UPDATE productos SET imagen_url = ? WHERE id = ?', [imagenUrl, req.params.id]);
    res.json({ imagen_url: imagenUrl });
  } catch (error) {
    next(error);
  }
}

async function crearVariante(req, res, next) {
  try {
    const { presentacion, contenido_neto, precio, sku, cantidad_disponible } = req.body;

    if (!presentacion || !precio || !sku) {
      return next(errorHttp(400, 'Presentación, precio y SKU son obligatorios'));
    }

    const [resultado] = await pool.query(
      'INSERT INTO variantes_producto (producto_id, presentacion, contenido_neto, precio, sku) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, presentacion, contenido_neto || null, precio, sku],
    );

    await pool.query('INSERT INTO inventario (variante_id, cantidad_disponible) VALUES (?, ?)', [
      resultado.insertId,
      cantidad_disponible || 0,
    ]);

    res.status(201).json({ id: resultado.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return next(errorHttp(409, 'Ya existe una variante con ese SKU'));
    next(error);
  }
}

async function actualizarVariante(req, res, next) {
  try {
    const campos = ['presentacion', 'contenido_neto', 'precio', 'sku', 'activo'];
    const actualizaciones = [];
    const valores = [];

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        actualizaciones.push(`${campo} = ?`);
        valores.push(req.body[campo]);
      }
    }

    if (actualizaciones.length > 0) {
      valores.push(req.params.varianteId);
      await pool.query(`UPDATE variantes_producto SET ${actualizaciones.join(', ')} WHERE id = ?`, valores);
    }

    res.json({ mensaje: 'Variante actualizada' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return next(errorHttp(409, 'Ya existe una variante con ese SKU'));
    next(error);
  }
}

async function eliminarVariante(req, res, next) {
  try {
    await pool.query('UPDATE variantes_producto SET activo = FALSE WHERE id = ?', [req.params.varianteId]);
    res.json({ mensaje: 'Variante desactivada' });
  } catch (error) {
    next(error);
  }
}

async function actualizarInventario(req, res, next) {
  try {
    const { cantidad_disponible } = req.body;

    if (cantidad_disponible === undefined || cantidad_disponible < 0) {
      return next(errorHttp(400, 'Cantidad inválida'));
    }

    await pool.query(
      `INSERT INTO inventario (variante_id, cantidad_disponible) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE cantidad_disponible = VALUES(cantidad_disponible)`,
      [req.params.varianteId, cantidad_disponible],
    );

    res.json({ mensaje: 'Inventario actualizado' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarProductosAdmin,
  obtenerProductoAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagenProducto,
  crearVariante,
  actualizarVariante,
  eliminarVariante,
  actualizarInventario,
};
