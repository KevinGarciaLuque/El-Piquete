const express = require('express');
const { listarOpinionesPublicas, crearOpinion } = require('../controllers/opiniones.controller');
const subirImagen = require('../middleware/upload');

const router = express.Router();

router.get('/', listarOpinionesPublicas);
router.post('/', subirImagen, crearOpinion);

module.exports = router;
