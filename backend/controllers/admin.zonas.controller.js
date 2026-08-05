const pool = require('../config/db');

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function listarZonasAdmin(req, res, next) {
  try {
    const [zonas] = await pool.query('SELECT * FROM zonas_entrega ORDER BY id DESC');
    res.json(zonas);
  } catch (error) {
    next(error);
  }
}

async function crearZona(req, res, next) {
  try {
    const { nombre, costo_envio, tiempo_estimado } = req.body;

    if (!nombre || costo_envio === undefined) {
      return next(errorHttp(400, 'Nombre y costo de envío son obligatorios'));
    }

    const [resultado] = await pool.query(
      'INSERT INTO zonas_entrega (nombre, costo_envio, tiempo_estimado) VALUES (?, ?, ?)',
      [nombre, costo_envio, tiempo_estimado || null],
    );

    res.status(201).json({ id: resultado.insertId });
  } catch (error) {
    next(error);
  }
}

async function actualizarZona(req, res, next) {
  try {
    const campos = ['nombre', 'costo_envio', 'tiempo_estimado', 'activo'];
    const actualizaciones = [];
    const valores = [];

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        actualizaciones.push(`${campo} = ?`);
        valores.push(req.body[campo]);
      }
    }

    if (actualizaciones.length === 0) return next(errorHttp(400, 'No hay campos para actualizar'));

    valores.push(req.params.id);
    const [resultado] = await pool.query(`UPDATE zonas_entrega SET ${actualizaciones.join(', ')} WHERE id = ?`, valores);

    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Zona no encontrada' });
    res.json({ mensaje: 'Zona actualizada' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarZonasAdmin, crearZona, actualizarZona };
