const express = require('express');
const {
  listarOpinionesAdmin,
  crearOpinionAdmin,
  actualizarOpinion,
  eliminarOpinion,
  subirFotoOpinion,
} = require('../controllers/admin.opiniones.controller');
const authMiddleware = require('../middleware/authMiddleware');
const subirImagen = require('../middleware/upload');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listarOpinionesAdmin);
router.post('/', crearOpinionAdmin);
router.post('/:id/imagen', subirImagen, subirFotoOpinion);
router.put('/:id', actualizarOpinion);
router.delete('/:id', eliminarOpinion);

module.exports = router;
