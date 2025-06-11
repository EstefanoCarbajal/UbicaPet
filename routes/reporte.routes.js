const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');

// Mostrar formulario
router.get('/reportar-perdida', reporteController.formReportarPerdida);

// Guardar reporte
router.post('/reportar-perdida', reporteController.guardarReportePerdida);

module.exports = router;
