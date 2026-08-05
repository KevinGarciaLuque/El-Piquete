const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { listarZonasAdmin, crearZona, actualizarZona } = require('../controllers/admin.zonas.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listarZonasAdmin);
router.post('/', crearZona);
router.put('/:id', actualizarZona);

module.exports = router;
