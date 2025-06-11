const db = require('../config/db');

exports.formReportarPerdida = async (req, res) => {
  if (!req.session || !req.session.usuario) return res.redirect('/login');

  const id_usuario = req.session.usuario.id;
  try {
    const [mascotas] = await db.query('SELECT * FROM mascotas WHERE id_usuario = ?', [id_usuario]);
    res.render('reportes/reportar_perdida', { mascotas });
  } catch (err) {
    console.error('Error al cargar formulario de reporte:', err);
    res.status(500).send('Error interno del servidor');
  }
};

exports.guardarReportePerdida = async (req, res) => {
  const { id_mascota, ubicacion_lat, ubicacion_lng, comentarios } = req.body;
  const ubicacion = `${ubicacion_lat},${ubicacion_lng}`;

  try {
    await db.query('INSERT INTO reportes_perdida (id_mascota, ubicacion, comentarios) VALUES (?, ?, ?)', [id_mascota, ubicacion, comentarios]);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error al guardar reporte:', err);
    res.status(500).send('Error al guardar el reporte');
  }
};
