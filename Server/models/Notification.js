const db = require('../db');

class Notification {
  static async create({ user_id, title, message, details, type, icon }) {
    const result = await db.query(
      `INSERT INTO notifications (user_id, title, message, details, type, icon)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, title, message, details, type, icon]
    );
    return result.rows[0];
  }

  static async getByUser(user_id) {
    const result = await db.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  }

  static async markAsRead(id) {
    const result = await db.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query(`DELETE FROM notifications WHERE id = $1`, [id]);
    return true;
  }

  static async clearAll(user_id) {
    await db.query(`DELETE FROM notifications WHERE user_id = $1`, [user_id]);
    return true;
  }
}

module.exports = Notification;