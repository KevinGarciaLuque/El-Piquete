const express = require('express');
const { crearPedido } = require('../controllers/pedidos.controller');

const router = express.Router();

router.post('/', crearPedido);

module.exports = router;
