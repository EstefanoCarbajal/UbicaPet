const mysql = require('mysql2');
require('dotenv').config();

// Crear la conexión usando variables del archivo .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Verificar conexión
connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  } else {
    console.log('✅ Conexión a la base de datos MySQL establecida correctamente');
  }
});

module.exports = connection;
