const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.get('/chat', chatController.mostrarChat);
router.post('/chat/enviar', chatController.enviarMensaje);

router.get('/chats', chatController.historialChats);


module.exports = router;