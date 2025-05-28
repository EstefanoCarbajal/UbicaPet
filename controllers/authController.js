const bcrypt = require('bcrypt');
const db = require('../config/db');

// Controlador para manejar el registro de usuarios
exports.registerUser = async (req, res) => {
  const { nombre, email, contrasena, confirmar } = req.body;

  // Validación simple
  if (!nombre || !email || !contrasena || !confirmar) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  if (contrasena !== confirmar) {
    return res.status(400).send('Las contraseñas no coinciden');
  }

  try {
    // Verificar si el correo ya existe
    const [rows] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).send('Este correo ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar usuario
    await db.query('INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)', [
      nombre,
      email,
      hashedPassword
    ]);

    res.status(200).json({ success: true, message: 'Registro exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
};


// Controlador para manejar el inicio de sesión de usuarios


exports.loginUser = async (req, res) => {
  console.log(req.body);
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    // Busca por email usando el campo "usuario"
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [usuario]);
    if (rows.length === 0) {
      return res.status(400).send('Usuario o contraseña incorrectos');
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.contrasena);
    if (!match) {
      return res.status(400).send('Usuario o contraseña incorrectos');
    }
    // Guarda el usuario en la sesión
    req.session.usuario = { nombre: user.nombre, email: user.email, id: user.id };
    // Si todo está bien, responde con éxito
    res.status(200).json({ success: true, message: 'Login exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
};