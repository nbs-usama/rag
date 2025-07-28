const { pool } = require('../config/database');

class Message {
  static async create(sessionId, sender, content, context = null) {
    const result = await pool.query(
      'INSERT INTO chat_messages (session_id, sender, content, context) VALUES ($1, $2, $3, $4) RETURNING *',
      [sessionId, sender, content, context]
    );
    return result.rows[0];
  }

  static async findBySessionId(sessionId, limit = 50, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3',
      [sessionId, limit, offset]
    );
    return result.rows;
  }
}

module.exports = Message;