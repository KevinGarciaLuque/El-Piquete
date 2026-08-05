const express = require('express');
const { crearPedido, listarPedidos, obtenerPedidoPorCodigo, actualizarEstadoPedido } = require('../controllers/pedidos.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', crearPedido);
router.get('/', authMiddleware, listarPedidos);
router.get('/:codigo', authMiddleware, obtenerPedidoPorCodigo);
router.patch('/:id/estado', authMiddleware, actualizarEstadoPedido);

module.exports = router;
