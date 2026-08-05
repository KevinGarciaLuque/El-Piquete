const express = require('express');
const { listarProductos, obtenerProductoPorSlug } = require('../controllers/productos.controller');

const router = express.Router();

router.get('/', listarProductos);
router.get('/:slug', obtenerProductoPorSlug);

module.exports = router;
