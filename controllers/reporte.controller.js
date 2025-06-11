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

exports.mostrarReportesEncontradas = async (req, res) => {
  // Consulta que une reportes, mascotas y usuarios
  const [reportes] = await db.query(`
    SELECT 
      r.id,
      r.comentarios,
      r.ubicacion,
      m.nombre AS nombre_mascota,
      m.foto,
      u.nombre AS usuario_nombre,
      u.id AS usuario_id
    FROM reportes_perdida r
    JOIN mascotas m ON r.id_mascota = m.id
    JOIN usuarios u ON m.id_usuario = u.id
  `);

  // Separar lat/lng si vienen juntos en un solo campo
  reportes.forEach(r => {
    if (r.ubicacion && r.ubicacion.includes(',')) {
      const [lat, lng] = r.ubicacion.split(',').map(Number);
      r.ubicacion_lat = lat;
      r.ubicacion_lng = lng;
    } else {
      r.ubicacion_lat = null;
      r.ubicacion_lng = null;
    }
  });

  res.render('reportes/reportes_encontradas', { reportes });
};