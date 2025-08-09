const db = require('../db');

class Wanted {
  // Get wanted item by ID
  static async getById(id) {
    const result = await db.query(
      `SELECT * FROM wanted_items WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Get all wanted items for a specific product
  static async getByProductId(productId) {
    const result = await db.query(
      `SELECT * FROM wanted_items WHERE product_id = $1 ORDER BY priority ASC, created_at DESC`,
      [productId]
    );
    return result.rows;
  }

  // Create a new wanted item
  static async create({ product_id, item_name, description, priority = 1 }) {
    const result = await db.query(
      `INSERT INTO wanted_items (product_id, item_name, description, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product_id, item_name, description, priority]
    );
    return result.rows[0];
  }

  // Update an existing wanted item
  static async update(id, { item_name, description, priority }) {
    const result = await db.query(
      `UPDATE wanted_items
       SET item_name = $1,
           description = $2,
           priority = $3
       WHERE id = $4
       RETURNING *`,
      [item_name, description, priority, id]
    );
    return result.rows[0] || null;
  }

  // Delete a wanted item
  static async delete(id) {
    const result = await db.query(
      `DELETE FROM wanted_items WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = Wanted;