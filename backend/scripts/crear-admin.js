require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function main() {
  const [nombre, correo, password] = process.argv.slice(2);

  if (!nombre || !correo || !password) {
    console.error('Uso: node scripts/crear-admin.js "Nombre" correo password');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO administradores (nombre, correo, password_hash)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password_hash = VALUES(password_hash)`,
    [nombre, correo, passwordHash],
  );

  console.log(`Administrador listo: ${correo}`);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
