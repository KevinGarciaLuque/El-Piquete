const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function login(req, res, next) {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    const [[admin]] = await pool.query(
      'SELECT id, nombre, correo, password_hash, rol FROM administradores WHERE correo = ? AND activo = TRUE',
      [correo],
    );

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { sub: admin.id, correo: admin.correo, rol: admin.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
    );

    res.json({ token, admin: { id: admin.id, nombre: admin.nombre, correo: admin.correo } });
  } catch (error) {
    next(error);
  }
}

function me(req, res) {
  res.json({ admin: req.admin });
}

module.exports = { login, me };
