const db = require('../db');

class Swap {
  // Create a new swap record when a trade is completed
  static async create({ product_id, offer_id, user_accepted = false, buyer_accepted = false, swaped = false }) {
    const result = await db.query(
      `INSERT INTO swaps (product_id, offer_id, user_accepted, buyer_accepted, swaped)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [product_id, offer_id, user_accepted, buyer_accepted, swaped]
    );
    return result.rows[0];
  }

  // Find a swap by its ID
  static async findById(id) {
    const result = await db.query(
      `SELECT s.*, p.title as product_title, o.offered_item_title, o.buyer_id
         FROM swaps s
         LEFT JOIN products p ON s.product_id = p.id
         LEFT JOIN offers o ON s.offer_id = o.id
        WHERE s.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // List all swaps for a user (as owner or buyer)
  static async findByUser(userId) {
    const result = await db.query(
      `SELECT s.*, p.title as product_title, o.offered_item_title, o.buyer_id
         FROM swaps s
         LEFT JOIN products p ON s.product_id = p.id
         LEFT JOIN offers o ON s.offer_id = o.id
        WHERE p.user_id = $1
           OR o.buyer_id = $1
        ORDER BY s.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // List all swaps for a product
  static async findByProduct(productId) {
    const result = await db.query(
      `SELECT s.*, o.offered_item_title, o.buyer_id
         FROM swaps s
         LEFT JOIN offers o ON s.offer_id = o.id
        WHERE s.product_id = $1
        ORDER BY s.created_at DESC`,
      [productId]
    );
    return result.rows;
  }

  // Mark a swap as completed
  static async markSwaped(id) {
    const result = await db.query(
      `UPDATE swaps SET swaped = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Swap; 