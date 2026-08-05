const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { listarCupones, crearCupon, actualizarCupon } = require('../controllers/admin.cupones.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listarCupones);
router.post('/', crearCupon);
router.put('/:id', actualizarCupon);

module.exports = router;
