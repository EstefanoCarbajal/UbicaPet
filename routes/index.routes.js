const express = require('express');
const router = express.Router();

// Ruta principal (http://localhost:3000/)
router.get('/', (req, res) => {
  res.render('index', { titulo: 'Bienvenido a UbicaPet' });
});

// Simulación: obtén el nombre del usuario desde la sesión o un objeto temporal
router.get('/dashboard', (req, res) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  res.render('dashboard', { nombre: req.session.usuario.nombre });
});


module.exports = router;
