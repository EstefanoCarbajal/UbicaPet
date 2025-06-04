const db = require('../config/db');



// Controlador para mostrar el formulario de registro de mascota
exports.mostrarFormulario = (req, res) => {
  res.render('mascotas/registrar_mascota');
};

// Controlador para registrar una nueva mascota
const QRCode = require('qrcode');

exports.registrarMascota = async (req, res) => {
  const { nombre, raza, edad, color } = req.body;
  const id_usuario = req.session.usuario.id;
  const foto = req.file ? req.file.filename : null;

  if (!nombre || !id_usuario) {
    return res.status(400).send('Todos los campos obligatorios deben ser completados');
  }

  try {
    // 1. Inserta la mascota
    const [result] = await db.query(
      'INSERT INTO mascotas (id_usuario, nombre, raza, edad, color, foto) VALUES (?, ?, ?, ?, ?, ?)',
      [id_usuario, nombre, raza, edad, color, foto]
    );
    const id_mascota = result.insertId;

    // 2. Prepara la información para el QR (puedes personalizar el contenido)
    const infoQR = `Mascota: ${nombre}\nRaza: ${raza}\nEdad: ${edad}\nColor: ${color}`;

    // 3. Genera el QR como imagen base64
    const qrDataUrl = await QRCode.toDataURL(infoQR);

    // 4. Guarda el QR en la tabla qr_generados
    await db.query(
      'INSERT INTO qr_generados (id_mascota, qr_url) VALUES (?, ?)',
      [id_mascota, qrDataUrl]
    );

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar mascota');
  }
};

exports.misMascotas = async (req, res) => {
  if (!req.session || !req.session.usuario || !req.session.usuario.id) {
    return res.redirect('/login');
  }
  const id_usuario = req.session.usuario.id;

  if (!id_usuario) {
    return res.redirect('/login');
  }

  try {
    const [mascotas] = await db.query('SELECT * FROM mascotas WHERE id_usuario = ?', [id_usuario]);
    res.render('mascotas/mis_mascotas', { mascotas });
  } catch (err) {
    console.error('Error al obtener las mascotas:', err);
    res.status(500).send('Error interno del servidor');
  }
};



// Eliminar mascota
exports.eliminarMascota = async (req, res) => {
  if (!req.session || !req.session.usuario || !req.session.usuario.id) {
    return res.redirect('/login');
  }
  const id_usuario = req.session.usuario.id;
  const id_mascota = req.params.id;

  try {
    await db.query('DELETE FROM mascotas WHERE id = ? AND id_usuario = ?', [id_mascota, id_usuario]);
    res.redirect('/mascotas/mis-mascotas');
  } catch (err) {
    console.error('Error al eliminar la mascota:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Solo UNA función verQR
exports.verQR = async (req, res) => {
  if (!req.session || !req.session.usuario || !req.session.usuario.id) {
    return res.redirect('/login');
  }

  const id_usuario = req.session.usuario.id;
  const id_mascota = req.params.id;

  try {
    const [result] = await db.query(
      `SELECT m.nombre, q.qr_url
       FROM mascotas m
       JOIN qr_generados q ON m.id = q.id_mascota
       WHERE m.id = ? AND m.id_usuario = ?`,
      [id_mascota, id_usuario]
    );

    if (result.length === 0) {
      return res.status(404).send('Mascota o QR no encontrado');
    }

    const mascota = result[0];
    res.render('mascotas/ver_qr', { mascota, qrUrl: mascota.qr_url });
  } catch (err) {
    console.error('Error al cargar el QR:', err);
    res.status(500).send('Error interno del servidor');
  }
};


// Mostrar formulario de edición
exports.formularioEditarMascota = async (req, res) => {
  if (!req.session || !req.session.usuario || !req.session.usuario.id) {
    return res.redirect('/login');
  }
  const id_usuario = req.session.usuario.id;
  const id_mascota = req.params.id;

  try {
    const [result] = await db.query(
      'SELECT * FROM mascotas WHERE id = ? AND id_usuario = ?',
      [id_mascota, id_usuario]
    );
    if (result.length === 0) {
      return res.status(404).send('Mascota no encontrada');
    }
    const mascota = result[0];
    res.render('mascotas/editar_mascota', { mascota });
  } catch (err) {
    console.error('Error al cargar la mascota para edición:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Guardar cambios de edición
exports.guardarEdicionMascota = async (req, res) => {
  if (!req.session || !req.session.usuario || !req.session.usuario.id) {
    return res.redirect('/login');
  }
  const id_usuario = req.session.usuario.id;
  const id_mascota = req.params.id;
  const { nombre, raza, edad, color } = req.body;
  const nuevaFoto = req.file ? req.file.filename : null;

  try {
    if (nuevaFoto) {
      await db.query(
        'UPDATE mascotas SET nombre = ?, raza = ?, edad = ?, color = ?, foto = ? WHERE id = ? AND id_usuario = ?',
        [nombre, raza, edad, color, nuevaFoto, id_mascota, id_usuario]
      );
    } else {
      await db.query(
        'UPDATE mascotas SET nombre = ?, raza = ?, edad = ?, color = ? WHERE id = ? AND id_usuario = ?',
        [nombre, raza, edad, color, id_mascota, id_usuario]
      );
    }
    res.redirect('/mascotas/mis-mascotas');
  } catch (err) {
    console.error('Error al guardar edición:', err);
    res.status(500).send('Error interno del servidor');
  }
};

