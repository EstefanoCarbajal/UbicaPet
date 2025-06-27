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
  // 1. Recibe los datos del formulario
  const { usuario, password } = req.body;

  // 2. Valida que los campos no estén vacíos
  if (!usuario || !password) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    // 3. Busca el usuario en la base de datos por email
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [usuario]);
    if (rows.length === 0) {
      return res.status(400).send('Usuario o contraseña incorrectos');
    }

    // 4. Compara la contraseña con bcrypt
    const user = rows[0];
    const match = await bcrypt.compare(password, user.contrasena);
    if (!match) {
      return res.status(400).send('Usuario o contraseña incorrectos');
    }

    // 5. Guarda el usuario en la sesión
    req.session.usuario = { nombre: user.nombre, email: user.email, id: user.id };

    // 6. Responde con éxito
    res.status(200).json({ success: true, message: 'Login exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
};

exports.mostrarPerfil = async (req, res) => {
  const usuario = req.session.usuario;
  if (!usuario) return res.redirect('/login');

  // Obtén los reportes del usuario
  const [reportes] = await db.query(
    `SELECT r.*, m.nombre AS nombre_mascota, m.foto
     FROM reportes_perdida r
     JOIN mascotas m ON r.id_mascota = m.id
     WHERE m.id_usuario = ?`,
    [usuario.id]
  );

  res.render('perfil', { usuario, reportes });
};



