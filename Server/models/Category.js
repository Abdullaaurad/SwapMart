const db = require('../db');

class Category {
  static async findAll() {
    const result = await db.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByName(name) {
    const result = await db.query(
      'SELECT * FROM categories WHERE name ILIKE $1',
      [`%${name}%`]
    );
    return result.rows;
  }

  static async create(categoryData) {
    const { name, description, icon } = categoryData;
    
    const result = await db.query(
      'INSERT INTO categories (name, description, icon) VALUES ($1, $2, $3) RETURNING *',
      [name, description, icon]
    );
    
    return result.rows[0];
  }

  static async update(id, updateData) {
    const { name, description, icon } = updateData;
    
    const result = await db.query(
      `UPDATE categories 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           icon = COALESCE($3, icon)
       WHERE id = $4 
       RETURNING *`,
      [name, description, icon, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    // Check if category has products
    const productsResult = await db.query(
      'SELECT COUNT(*) FROM products WHERE category_id = $1',
      [id]
    );
    
    if (parseInt(productsResult.rows[0].count) > 0) {
      throw new Error('Cannot delete category with existing products');
    }
    
    const result = await db.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }

  static async getWithProductCount() {
    const result = await db.query(
      `SELECT c.*, COUNT(p.id) as product_count 
       FROM categories c 
       LEFT JOIN products p ON c.id = p.category_id AND p.is_available = true 
       GROUP BY c.id 
       ORDER BY c.name ASC`
    );
    return result.rows;
  }
}

module.exports = Category; 