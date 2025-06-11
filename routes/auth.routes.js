const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// filepath: routes/auth.routes.js
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Ruta para manejar el inicio de sesión de usuarios
router.post('/login', authController.loginUser);


router.get('/register', (req, res) => {
  res.render('auth/register');
});
// Ruta para manejar el registro de usuarios
router.post('/register', authController.registerUser);

// Ruta para manejar el cierre de sesión
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


module.exports = router;
