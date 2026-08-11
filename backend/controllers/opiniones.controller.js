const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const pool = require('../config/db');

const CARPETA_UPLOADS = path.join(__dirname, '..', 'uploads', 'opiniones');

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function listarOpinionesPublicas(req, res, next) {
  try {
    const [opiniones] = await pool.query(
      `SELECT id, nombre, calificacion, comentario, foto_url, created_at
       FROM opiniones
       WHERE estado = 'aprobada'
       ORDER BY created_at DESC
       LIMIT 30`,
    );
    res.json(opiniones);
  } catch (error) {
    next(error);
  }
}

async function crearOpinion(req, res, next) {
  try {
    const { codigoPedido, telefono, nombre, comentario } = req.body;
    const calificacion = Number(req.body.calificacion);

    if (!codigoPedido || !telefono || !nombre || !comentario) {
      return next(errorHttp(400, 'Faltan datos obligatorios'));
    }
    if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
      return next(errorHttp(400, 'La calificación debe ser un número entre 1 y 5'));
    }

    const [[pedido]] = await pool.query(
      `SELECT p.id, p.estado, c.id AS cliente_id, c.telefono
       FROM pedidos p
       JOIN clientes c ON c.id = p.cliente_id
       WHERE p.codigo = ?`,
      [codigoPedido],
    );

    if (!pedido) {
      return next(errorHttp(404, 'Pedido no encontrado'));
    }
    if (pedido.telefono.trim() !== telefono.trim()) {
      return next(errorHttp(400, 'El teléfono no coincide con el pedido'));
    }
    if (pedido.estado !== 'entregado') {
      return next(errorHttp(400, 'Tu pedido aún no está marcado como entregado'));
    }

    const [[existente]] = await pool.query('SELECT id FROM opiniones WHERE pedido_id = ?', [pedido.id]);
    if (existente) {
      return next(errorHttp(409, 'Ya enviaste una opinión para este pedido'));
    }

    let fotoUrl = null;
    if (req.file) {
      const nombreArchivo = `opinion-${pedido.id}-${Date.now()}.webp`;
      await fs.mkdir(CARPETA_UPLOADS, { recursive: true });
      await sharp(req.file.buffer)
        .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(CARPETA_UPLOADS, nombreArchivo));
      fotoUrl = `/uploads/opiniones/${nombreArchivo}`;
    }

    await pool.query(
      `INSERT INTO opiniones (pedido_id, cliente_id, nombre, calificacion, comentario, foto_url, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
      [pedido.id, pedido.cliente_id, nombre, calificacion, comentario, fotoUrl],
    );

    res.status(201).json({ mensaje: 'Tu opinión fue enviada y será publicada luego de revisión.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarOpinionesPublicas, crearOpinion };
