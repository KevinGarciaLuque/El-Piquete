const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const pool = require('../config/db');

const CARPETA_UPLOADS = path.join(__dirname, '..', 'uploads', 'opiniones');
const ESTADOS_OPINION = ['pendiente', 'aprobada', 'rechazada'];

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function listarOpinionesAdmin(req, res, next) {
  try {
    const { estado } = req.query;
    const condiciones = [];
    const parametros = [];

    if (estado) {
      condiciones.push('o.estado = ?');
      parametros.push(estado);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    const [opiniones] = await pool.query(
      `SELECT o.*, p.codigo AS pedido_codigo
       FROM opiniones o
       LEFT JOIN pedidos p ON p.id = o.pedido_id
       ${where}
       ORDER BY o.created_at DESC`,
      parametros,
    );

    res.json(opiniones);
  } catch (error) {
    next(error);
  }
}

async function crearOpinionAdmin(req, res, next) {
  try {
    const { nombre, comentario } = req.body;
    const calificacion = Number(req.body.calificacion);
    const estado = req.body.estado || 'aprobada';

    if (!nombre || !comentario) {
      return next(errorHttp(400, 'Nombre y comentario son obligatorios'));
    }
    if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
      return next(errorHttp(400, 'La calificación debe ser un número entre 1 y 5'));
    }
    if (!ESTADOS_OPINION.includes(estado)) {
      return next(errorHttp(400, 'Estado inválido'));
    }

    const [resultado] = await pool.query(
      `INSERT INTO opiniones (nombre, calificacion, comentario, estado, moderado_en)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, calificacion, comentario, estado, estado === 'pendiente' ? null : new Date()],
    );

    res.status(201).json({ id: resultado.insertId });
  } catch (error) {
    next(error);
  }
}

async function actualizarOpinion(req, res, next) {
  try {
    const campos = ['nombre', 'calificacion', 'comentario', 'estado'];
    const actualizaciones = [];
    const valores = [];

    if (req.body.estado !== undefined && !ESTADOS_OPINION.includes(req.body.estado)) {
      return next(errorHttp(400, 'Estado inválido'));
    }

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        actualizaciones.push(`${campo} = ?`);
        valores.push(req.body[campo]);
      }
    }

    if (req.body.estado !== undefined) {
      actualizaciones.push('moderado_en = ?');
      valores.push(new Date());
    }

    if (actualizaciones.length === 0) return next(errorHttp(400, 'No hay campos para actualizar'));

    valores.push(req.params.id);
    const [resultado] = await pool.query(`UPDATE opiniones SET ${actualizaciones.join(', ')} WHERE id = ?`, valores);

    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Opinión no encontrada' });
    res.json({ mensaje: 'Opinión actualizada' });
  } catch (error) {
    next(error);
  }
}

async function eliminarOpinion(req, res, next) {
  try {
    const [resultado] = await pool.query('DELETE FROM opiniones WHERE id = ?', [req.params.id]);
    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Opinión no encontrada' });
    res.json({ mensaje: 'Opinión eliminada' });
  } catch (error) {
    next(error);
  }
}

async function subirFotoOpinion(req, res, next) {
  try {
    if (!req.file) return next(errorHttp(400, 'No se recibió ninguna imagen'));

    const nombreArchivo = `opinion-${req.params.id}-${Date.now()}.webp`;
    await fs.mkdir(CARPETA_UPLOADS, { recursive: true });
    await sharp(req.file.buffer)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(CARPETA_UPLOADS, nombreArchivo));

    const fotoUrl = `/uploads/opiniones/${nombreArchivo}`;
    const [resultado] = await pool.query('UPDATE opiniones SET foto_url = ? WHERE id = ?', [fotoUrl, req.params.id]);

    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Opinión no encontrada' });
    res.json({ foto_url: fotoUrl });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarOpinionesAdmin,
  crearOpinionAdmin,
  actualizarOpinion,
  eliminarOpinion,
  subirFotoOpinion,
};
