const db = require('../db');

class Offer {
  static async findById(id) {
    const result = await db.query(
      `SELECT * FROM offers WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findOffersforProduct(productId) {
    const result = await db.query(
      `SELECT * FROM offers where product_id = $1 ORDER BY created_at DESC`,
      [productId]
    );
    return result.rows;
  }

  static async findByBuyer(buyerId) {
    const result = await db.query(
      `SELECT *
       FROM offers
       WHERE buyer_id = $1
       ORDER BY o.created_at DESC`,
      [buyerId]
    );
    return result.rows;
  }

  static async findByProduct(Id){
    const result = await db.query (
      `SELECT * FROM offers WHERE product_id = $1`,
      [Id]
    );
    return result.rows;
  }

  static async findBySeller(sellerId) {
    const result = await db.query(
      `SELECT o.*, p.title as product_title, p.images as product_images,
              u.username as buyer_name
       FROM offers o
       LEFT JOIN products p ON o.product_id = p.id
       LEFT JOIN users u ON o.buyer_id = u.id
       WHERE o.seller_id = $1
       ORDER BY o.created_at DESC`,
      [sellerId]
    );
    return result.rows;
  }

  static async findByProduct(productId) {
    const result = await db.query(
      `SELECT o.*, u.username as buyer_name
       FROM offers o
       LEFT JOIN users u ON o.buyer_id = u.id
       WHERE o.product_id = $1
       ORDER BY o.created_at DESC`,
      [productId]
    );
    return result.rows;
  }

  static async create(offerData) {
    const {
      product_id,
      buyer_id,
      seller_id,
      offered_item_title,
      offered_item_description,
      offered_item_images,
      message,
      status = 'pending'
    } = offerData;

    const result = await db.query(
      `INSERT INTO offers (
        product_id, buyer_id, seller_id, offered_item_title, offered_item_description, offered_item_images, message, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        product_id,
        buyer_id,
        seller_id,
        offered_item_title,
        offered_item_description,
        JSON.stringify(offered_item_images || []),
        message,
        status
      ]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    const result = await db.query(
      `UPDATE offers 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM offers WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async getPendingOffersForProduct(productId) {
    const result = await db.query(
      `SELECT o.*, u.username as buyer_name
       FROM offers o
       LEFT JOIN users u ON o.buyer_id = u.id
       WHERE o.product_id = $1 AND o.status = 'pending'
       ORDER BY o.created_at ASC`,
      [productId]
    );
    return result.rows;
  }
}

module.exports = Offer; 