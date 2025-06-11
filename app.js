const express = require('express');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const session = require('express-session');
const app = express();
const mascotaRoutes = require('./routes/mascotas.routes');

// Conexión a la base de datos
require('./config/db');

// Middlewares para leer datos de formularios y JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

// Middleware de sesión
app.use(session({
  secret: 'ubicapet-secret', // Usa un secreto seguro en producción
  resave: false,
  saveUninitialized: false
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));

app.use('/mascotas', require('./routes/mascotas.routes'));

app.use('/', require('./routes/reporte.routes'));


// Servidor en escucha
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;