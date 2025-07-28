const Joi = require('joi');
const Session = require('../models/Session');
const logger = require('../utils/logger');

const createSessionSchema = Joi.object({
  name: Joi.string().min(1).max(255).required()
});

const updateSessionSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  is_favorite: Joi.boolean()
}).min(1);

const createSession = async (req, res, next) => {
  try {
    const { error, value } = createSessionSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const session = await Session.create(value.name);
    logger.info('Session created', { sessionId: session.id });
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const { error, value } = updateSessionSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const session = await Session.update(req.params.id, value);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    logger.info('Session updated', { sessionId: session.id });
    res.json(session);
  } catch (err) {
    next(err);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    await Session.delete(req.params.id);
    logger.info('Session deleted', { sessionId: req.params.id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { createSession, updateSession, deleteSession };