const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const upload = require('../middlewares/upload');

// Mostrar formulario
router.get('/registrar', mascotaController.mostrarFormulario);

// Procesar formulario
router.post('/registrar', upload.single('foto'), mascotaController.registrarMascota);

// Ruta para mostrar las mascotas del usuario
router.get('/mis-mascotas', mascotaController.misMascotas);

// Ver código QR
router.get('/ver_qr/:id', mascotaController.verQR);

// Editar mascota
router.get('/editar/:id', mascotaController.formularioEditarMascota);
router.post('/editar/:id', upload.single('foto'), mascotaController.guardarEdicionMascota);

// Eliminar mascota
router.post('/eliminar/:id', mascotaController.eliminarMascota);



module.exports = router;

