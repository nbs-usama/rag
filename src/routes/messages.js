const express = require('express');
const { createMessage, getMessages } = require('../controllers/messageController');

const router = express.Router();

/**
 * @swagger
 * /api/sessions/{sessionId}/messages:
 *   post:
 *     summary: Add a message to a chat session
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 enum: [user, assistant]
 *               content:
 *                 type: string
 *               context:
 *                 type: object
 *     responses:
 *       201:
 *         description: Message created successfully
 */
router.post('/:sessionId/messages', createMessage);

/**
 * @swagger
 * /api/sessions/{sessionId}/messages:
 *   get:
 *     summary: Get messages from a chat session
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 */
router.get('/:sessionId/messages', getMessages);

module.exports = router;