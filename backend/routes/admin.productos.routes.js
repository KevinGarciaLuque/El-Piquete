const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const subirImagen = require('../middleware/upload');
const {
  listarProductosAdmin,
  obtenerProductoAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagenProducto,
  crearVariante,
  actualizarVariante,
  eliminarVariante,
  actualizarInventario,
} = require('../controllers/admin.productos.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listarProductosAdmin);
router.post('/', crearProducto);
router.get('/:id', obtenerProductoAdmin);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);
router.post('/:id/imagen', subirImagen, subirImagenProducto);
router.post('/:id/variantes', crearVariante);
router.put('/variantes/:varianteId', actualizarVariante);
router.delete('/variantes/:varianteId', eliminarVariante);
router.patch('/variantes/:varianteId/inventario', actualizarInventario);

module.exports = router;
