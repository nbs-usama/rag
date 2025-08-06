const express = require('express');
const { chatWithRAG, uploadDocument } = require('../controllers/ragController');
const { createSession, updateSession, deleteSession } = require('../controllers/sessionController');
const { getMessages } = require('../controllers/messageController');

const router = express.Router();

// Session management
router.post('/sessions', createSession);
router.put('/sessions/:id', updateSession);
router.delete('/sessions/:id', deleteSession);

// Messages
router.get('/sessions/:sessionId/messages', getMessages);

// RAG Chat
router.post('/sessions/:sessionId/chat', chatWithRAG);

// Document upload
router.post('/documents', uploadDocument);

module.exports = router;