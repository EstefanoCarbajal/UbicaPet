const db = require('../config/db');

// Mostrar el chat entre el usuario actual y el usuario destino
exports.mostrarChat = async (req, res) => {
  const usuario_actual = req.session.usuario;
  const usuario_destino_id = parseInt(req.query.usuario);

  // 1. Buscar o crear la conversación entre ambos usuarios
  let [convs] = await db.query(
    `SELECT * FROM conversaciones 
     WHERE (id_usuario_1 = ? AND id_usuario_2 = ?) 
        OR (id_usuario_1 = ? AND id_usuario_2 = ?)`,
    [usuario_actual.id, usuario_destino_id, usuario_destino_id, usuario_actual.id]
  );

  let conversacion;
  if (convs.length === 0) {
    // Crear la conversación si no existe
    const [result] = await db.query(
      'INSERT INTO conversaciones (id_usuario_1, id_usuario_2) VALUES (?, ?)',
      [usuario_actual.id, usuario_destino_id]
    );
    conversacion = { id: result.insertId, id_usuario_1: usuario_actual.id, id_usuario_2: usuario_destino_id };
  } else {
    conversacion = convs[0];
  }

  // 2. Obtener los mensajes de la conversación
  const [mensajes] = await db.query(
    `SELECT m.*, u.nombre AS emisor_nombre
     FROM mensajes m
     JOIN usuarios u ON m.emisor_id = u.id
     WHERE m.id_conversacion = ?
     ORDER BY m.fecha_hora ASC`,
    [conversacion.id]
  );

  // 3. Obtener datos del usuario destino
  const [[usuario_destino]] = await db.query(
    'SELECT id, nombre FROM usuarios WHERE id = ?',
    [usuario_destino_id]
  );

  res.render('chat', {
    usuario_actual,
    usuario_destino,
    mensajes,
    conversacion_id: conversacion.id
  });
};

// Enviar un mensaje
exports.enviarMensaje = async (req, res) => {
  const usuario_actual = req.session.usuario;
  const { conversacion_id, mensaje, destino_id } = req.body;

  if (!mensaje.trim()) {
    return res.redirect(`/chat?usuario=${destino_id}`);
  }

  await db.query(
    'INSERT INTO mensajes (id_conversacion, emisor_id, mensaje) VALUES (?, ?, ?)',
    [conversacion_id, usuario_actual.id, mensaje]
  );

  res.redirect(`/chat?usuario=${destino_id}`);
};


exports.historialChats = async (req, res) => {
  const usuario_actual = req.session.usuario;

  // Buscar todas las conversaciones donde el usuario participa
  const [conversaciones] = await db.query(`
    SELECT c.id, 
           u.id AS usuario_id, 
           u.nombre AS usuario_nombre
    FROM conversaciones c
    JOIN usuarios u 
      ON (u.id = c.id_usuario_1 AND c.id_usuario_2 = ?) 
      OR (u.id = c.id_usuario_2 AND c.id_usuario_1 = ?)
    WHERE c.id_usuario_1 = ? OR c.id_usuario_2 = ?
  `, [usuario_actual.id, usuario_actual.id, usuario_actual.id, usuario_actual.id]);

  res.render('chat_historial', { conversaciones, usuario_actual });
};