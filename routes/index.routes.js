const express = require('express');
const router = express.Router();

// Ruta principal (http://localhost:3000/)
router.get('/', (req, res) => {
  res.render('index', { titulo: 'Bienvenido a UbicaPet' });
});


module.exports = router;
