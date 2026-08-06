const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarPassword,
  eliminarUsuario,
} = require('../controllers/admin.usuarios.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listarUsuarios);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.patch('/:id/password', cambiarPassword);
router.delete('/:id', eliminarUsuario);

module.exports = router;
