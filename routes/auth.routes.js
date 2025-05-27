const express = require('express');
const router = express.Router();

// filepath: routes/auth.routes.js
router.get('/login', (req, res) => {
  res.render('auth/login');
});

module.exports = router;

