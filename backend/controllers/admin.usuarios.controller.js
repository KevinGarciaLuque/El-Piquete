const bcrypt = require('bcryptjs');
const pool = require('../config/db');

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function listarUsuarios(req, res, next) {
  try {
    const [usuarios] = await pool.query(
      'SELECT id, nombre, correo, rol, activo, created_at FROM administradores ORDER BY id',
    );
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function crearUsuario(req, res, next) {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return next(errorHttp(400, 'Nombre, correo y contraseña son obligatorios'));
    }
    if (password.length < 6) {
      return next(errorHttp(400, 'La contraseña debe tener al menos 6 caracteres'));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [resultado] = await pool.query(
      'INSERT INTO administradores (nombre, correo, password_hash) VALUES (?, ?, ?)',
      [nombre, correo, passwordHash],
    );

    res.status(201).json({ id: resultado.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return next(errorHttp(409, 'Ya existe un usuario con ese correo'));
    next(error);
  }
}

async function actualizarUsuario(req, res, next) {
  try {
    const campos = ['nombre', 'correo', 'activo'];
    const actualizaciones = [];
    const valores = [];

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        actualizaciones.push(`${campo} = ?`);
        valores.push(req.body[campo]);
      }
    }

    if (actualizaciones.length === 0) return next(errorHttp(400, 'No hay campos para actualizar'));

    if (req.body.activo === false && String(req.admin.sub) === String(req.params.id)) {
      return next(errorHttp(400, 'No puedes desactivar tu propia cuenta'));
    }

    valores.push(req.params.id);
    const [resultado] = await pool.query(`UPDATE administradores SET ${actualizaciones.join(', ')} WHERE id = ?`, valores);

    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return next(errorHttp(409, 'Ya existe un usuario con ese correo'));
    next(error);
  }
}

async function cambiarPassword(req, res, next) {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return next(errorHttp(400, 'La contraseña debe tener al menos 6 caracteres'));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [resultado] = await pool.query('UPDATE administradores SET password_hash = ? WHERE id = ?', [
      passwordHash,
      req.params.id,
    ]);

    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Contraseña actualizada' });
  } catch (error) {
    next(error);
  }
}

async function eliminarUsuario(req, res, next) {
  try {
    if (String(req.admin.sub) === String(req.params.id)) {
      return next(errorHttp(400, 'No puedes eliminar tu propia cuenta'));
    }

    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM administradores');
    if (total <= 1) {
      return next(errorHttp(400, 'No puedes eliminar el único usuario administrador'));
    }

    const [resultado] = await pool.query('DELETE FROM administradores WHERE id = ?', [req.params.id]);
    if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarUsuarios, crearUsuario, actualizarUsuario, cambiarPassword, eliminarUsuario };
