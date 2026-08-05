const pool = require('../config/db');

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function listarCupones(req, res, next) {
  try {
    const [cupones] = await pool.query('SELECT * FROM cupones ORDER BY id DESC');
    res.json(cupones);
  } catch (error) {
    next(error);
  }
}

async function crearCupon(req, res, next) {
  try {
    const { codigo, tipo, valor, fecha_inicio, fecha_fin, usos_maximos } = req.body;

    if (!codigo || !tipo || !valor) {
      return next(errorHttp(400, 'Código, tipo y valor son obligatorios'));
    }

    const [resultado] = await pool.query(
      `INSERT INTO cupones (codigo, tipo, valor, fecha_inicio, fecha_fin, usos_maximos)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo.toUpperCase(), tipo, valor, fecha_inicio || null, fecha_fin || null, usos_maximos || null],
    );

    res.status(201).json({ id: resultado.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return next(errorHttp(409, 'Ya existe un cupón con ese código'));
    next(error);
  }
}

async function actualizarCupon(req, res, next) {
  try {
    const campos = ['codigo', 'tipo', 'valor', 'fecha_inicio', 'fecha_fin', 'usos_maximos', 'activo'];
    const actualizaciones = [];
    const valores = [];

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        actualizaciones.push(`${campo} = ?`);
        valores.push(campo === 'codigo' ? req.body[campo].toUpperCase() : req.body[campo]);
      }
    }

    if (actualizaciones.length === 0) return next(errorHttp(400, 'No hay campos para actualizar'));

    valores.push(req.params.id);
    const [resultado] = await pool.query(`UPDATE cupones SET ${actualizaciones.join(', ')} WHERE id = ?`, valores);

    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Cupón no encontrado' });
    res.json({ mensaje: 'Cupón actualizado' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return next(errorHttp(409, 'Ya existe un cupón con ese código'));
    next(error);
  }
}

module.exports = { listarCupones, crearCupon, actualizarCupon };
