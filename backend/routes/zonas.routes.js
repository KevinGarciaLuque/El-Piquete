const express = require('express');
const { listarZonas } = require('../controllers/zonas.controller');

const router = express.Router();

router.get('/', listarZonas);

module.exports = router;
