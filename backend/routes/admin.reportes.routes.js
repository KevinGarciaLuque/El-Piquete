const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { resumen, exportarPedidosCsv } = require('../controllers/admin.reportes.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/resumen', resumen);
router.get('/pedidos.csv', exportarPedidosCsv);

module.exports = router;
