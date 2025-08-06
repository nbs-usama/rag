const RAGService = require('../services/ragService');
const Session = require('../models/Session');
const Message = require('../models/Message');
const logger = require('../utils/logger');

const chatWithRAG = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get conversation history
    const history = await Message.findBySessionId(sessionId, 10);
    const conversationHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Retrieve relevant documents
    const retrievedDocs = await RAGService.retrieveRelevantDocuments(query);
    
    // Generate AI response
    const aiResponse = await RAGService.generateResponse(query, retrievedDocs, conversationHistory);

    // Store user message
    await Message.create(sessionId, 'user', query);

    // Store AI response with retrieved context
    await Message.create(sessionId, 'assistant', aiResponse.content, {
      retrievedDocuments: aiResponse.retrievedContext,
      model: process.env.OPENAI_MODEL
    });

    res.json({
      response: aiResponse.content,
      retrievedContext: aiResponse.retrievedContext
    });

  } catch (error) {
    logger.error('RAG chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const { content, source, title } = req.body;

    if (!content || !source) {
      return res.status(400).json({ error: 'Content and source are required' });
    }

    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await RAGService.storeDocument(content, {
      id: documentId,
      source,
      title: title || source,
      uploadedAt: new Date().toISOString()
    });

    res.json({ 
      message: 'Document uploaded successfully',
      documentId 
    });

  } catch (error) {
    logger.error('Document upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { chatWithRAG, uploadDocument };