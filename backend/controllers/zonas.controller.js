const pool = require('../config/db');

async function listarZonas(req, res, next) {
  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, costo_envio, tiempo_estimado FROM zonas_entrega WHERE activo = TRUE ORDER BY costo_envio',
    );
    res.json(filas);
  } catch (error) {
    next(error);
  }
}

module.exports = { listarZonas };
