const { pool } = require('../config/database');

class Session {
  static async create(name) {
    const result = await pool.query(
      'INSERT INTO chat_sessions (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM chat_sessions WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    
    const result = await pool.query(
      `UPDATE chat_sessions SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM chat_sessions WHERE id = $1', [id]);
  }
}

module.exports = Session;