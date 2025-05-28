const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// filepath: routes/auth.routes.js
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', authController.registerUser);



module.exports = router;

