// Importaciones necesarias
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la app
const app = express();

// Conexión a la base de datos
require('./config/db');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas (ej: EJS, si usas otro puedes cambiarlo)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
// Aquí irán tus archivos de rutas (cuando los crees)
app.use('/', require('./routes/index.routes')); // Ruta de ejemplo (por defecto)

// Servidor en escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
