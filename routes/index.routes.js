const express = require('express');
const router = express.Router();

// Ruta principal (http://localhost:3000/)
router.get('/', (req, res) => {
  res.render('index', { titulo: 'Bienvenido a UbicaPet' });
});

router.get('/login', (req, res) => {
  res.render('login');
});
module.exports = router;
