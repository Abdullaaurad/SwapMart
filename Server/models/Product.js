const db = require('../db');

class Product {
  static async findById(id) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.seller_id = u.id 
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findBySeller(sellerId) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.seller_id = $1 
       ORDER BY p.created_at DESC`,
      [sellerId]
    );
    return result.rows;
  }

  static async findByCategory(categoryId, limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.seller_id = u.id 
       WHERE p.category_id = $1 AND p.is_available = true 
       ORDER BY p.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [categoryId, limit, offset]
    );
    return result.rows;
  }

  static async findAll(limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.seller_id = u.id 
       WHERE p.is_available = true 
       ORDER BY p.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async search(query, limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.seller_id = u.id 
       WHERE p.is_available = true 
       AND (p.title ILIKE $1 OR p.description ILIKE $1) 
       ORDER BY p.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [`%${query}%`, limit, offset]
    );
    return result.rows;
  }

  static async create(productData) {
    const { title, description, price, category_id, seller_id, condition, images, location } = productData;
    
    const result = await db.query(
      `INSERT INTO products (title, description, price, category_id, seller_id, condition, images, location) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [title, description, price, category_id, seller_id, condition, images, location]
    );
    
    return result.rows[0];
  }

  static async update(id, updateData) {
    const { title, description, price, category_id, condition, images, location, is_available } = updateData;
    
    const result = await db.query(
      `UPDATE products 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category_id = COALESCE($4, category_id),
           condition = COALESCE($5, condition),
           images = COALESCE($6, images),
           location = COALESCE($7, location),
           is_available = COALESCE($8, is_available),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 
       RETURNING *`,
      [title, description, price, category_id, condition, images, location, is_available, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async markAsUnavailable(id) {
    const result = await db.query(
      'UPDATE products SET is_available = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Product; 