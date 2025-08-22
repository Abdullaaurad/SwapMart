// models/RecentView.js
const db = require('../db');

// models/LikedProduct.js
class LikedProduct {
  // Add a like for a product
  static async addLike(userId, productId) {
    try {
      const result = await db.query(
        `INSERT INTO liked_products (user_id, product_id, liked_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, product_id) DO NOTHING
         RETURNING *`,
        [userId, productId]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to add like: ' + error.message);
    }
  }

  // Remove a like for a product
  static async removeLike(likeId) {
    try {
      const result = await db.query(
        'DELETE FROM liked_products WHERE id = $1  RETURNING *',
        [likeId]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to remove like: ' + error.message);
    }
  }

  // Toggle like status
  static async toggleLike(userId, productId) {
    try {
      // Check if already liked
      const existing = await this.isLiked(userId, productId);
      
      if (existing) {
        await this.removeLike(userId, productId);
        return { liked: false, message: 'Like removed' };
      } else {
        await this.addLike(userId, productId);
        return { liked: true, message: 'Like added' };
      }
    } catch (error) {
      throw new Error('Failed to toggle like: ' + error.message);
    }
  }

  // Get user's liked products with details
  static async getUserLikedProducts(userId, limit = 20) {
    try {
      const result = await db.query(
        `SELECT lp.id, lp.liked_at,
                p.id as product_id, p.title, p.description, p.condition, 
                p.original_price, p.images, p.location, p.status, p.is_available,
                c.name as category_name, c.icon as category_icon,
                u.username as owner_username, u.profile_image as owner_image
         FROM liked_products lp
         JOIN products p ON lp.product_id = p.id
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN users u ON p.user_id = u.id
         WHERE lp.user_id = $1 AND p.status = 'active' AND p.is_available = true
         ORDER BY lp.liked_at DESC
         LIMIT $2`,
        [userId, limit]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to get liked products: ' + error.message);
    }
  }

  // Check if user has liked a product
  static async isLiked(userId, productId) {
    try {
      const result = await db.query(
        'SELECT id FROM liked_products WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw new Error('Failed to check like status: ' + error.message);
    }
  }

  // Get most liked products
  static async getMostLikedProducts(limit = 10, days = 30) {
    try {
      const result = await db.query(
        `SELECT p.id, p.title, p.description, p.condition, p.original_price, 
                p.images, p.location, p.view_count,
                COUNT(lp.id) as total_likes,
                c.name as category_name, c.icon as category_icon,
                u.username as owner_username
         FROM products p
         LEFT JOIN liked_products lp ON p.id = lp.product_id
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN users u ON p.user_id = u.id
         WHERE p.status = 'active' AND p.is_available = true
               AND (lp.liked_at > CURRENT_DATE - INTERVAL '${days} days' OR lp.liked_at IS NULL)
         GROUP BY p.id, c.name, c.icon, u.username
         HAVING COUNT(lp.id) > 0
         ORDER BY total_likes DESC, p.created_at DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to get most liked products: ' + error.message);
    }
  }

  // Get like statistics for a product
  static async getProductLikeStats(productId) {
    try {
      const result = await db.query(
        `SELECT COUNT(*) as total_likes,
                MAX(liked_at) as last_liked,
                MIN(liked_at) as first_liked
         FROM liked_products 
         WHERE product_id = $1`,
        [productId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to get like stats: ' + error.message);
    }
  }

  // Get users who liked a product
  static async getProductLikers(productId, limit = 10) {
    try {
      const result = await db.query(
        `SELECT u.id, u.username, u.profile_image, lp.liked_at
         FROM liked_products lp
         JOIN users u ON lp.user_id = u.id
         WHERE lp.product_id = $1
         ORDER BY lp.liked_at DESC
         LIMIT $2`,
        [productId, limit]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to get product likers: ' + error.message);
    }
  }

  // Clear all likes for a user
  static async clearUserLikes(userId) {
    try {
      const result = await db.query(
        'DELETE FROM liked_products WHERE user_id = $1 RETURNING *',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to clear user likes: ' + error.message);
    }
  }

  // Get like count for multiple products
  static async getProductsLikeCounts(productIds) {
    try {
      const result = await db.query(
        `SELECT product_id, COUNT(*) as like_count
         FROM liked_products 
         WHERE product_id = ANY($1)
         GROUP BY product_id`,
        [productIds]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to get products like counts: ' + error.message);
    }
  }
}

module.exports = LikedProduct ;