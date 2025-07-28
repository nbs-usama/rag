const express = require('express');
const { createSession, updateSession, deleteSession } = require('../controllers/sessionController');

const router = express.Router();

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Create a new chat session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session created successfully
 */
router.post('/', createSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Update a chat session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               is_favorite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Session updated successfully
 */
router.put('/:id', updateSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Delete a chat session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Session deleted successfully
 */
router.delete('/:id', deleteSession);

module.exports = router;