const Joi = require('joi');
const Message = require('../models/Message');
const Session = require('../models/Session');
const logger = require('../utils/logger');

const createMessageSchema = Joi.object({
  sender: Joi.string().valid('user', 'assistant').required(),
  content: Joi.string().min(1).required(),
  context: Joi.object().optional()
});

const createMessage = async (req, res, next) => {
  try {
    const { error, value } = createMessageSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const message = await Message.create(
      req.params.sessionId,
      value.sender,
      value.content,
      value.context
    );

    logger.info('Message created', { sessionId: req.params.sessionId, messageId: message.id });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    const messages = await Message.findBySessionId(req.params.sessionId, limit, offset);
    res.json({ messages, pagination: { limit, offset, count: messages.length } });
  } catch (err) {
    next(err);
  }
};

module.exports = { createMessage, getMessages };