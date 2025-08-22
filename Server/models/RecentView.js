// models/RecentView.js
const db = require('../db');

class RecentView {
  // Add a product view for a user
  static async addView(userId, productId) {
    try {
      const result = await db.query(
        `INSERT INTO recent_views (user_id, product_id, viewed_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, product_id) 
         DO UPDATE SET viewed_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [userId, productId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to add view: ' + error.message);
    }
  }

  // Get user's recent views with product details
  static async getUserRecentViews(userId, limit = 10) {
    try {
      const result = await db.query(
        `SELECT rv.id, rv.viewed_at, 
                p.id as product_id, p.title, p.description, p.condition, 
                p.original_price, p.images, p.location, p.status, p.is_available,
                c.name as category_name, c.icon as category_icon,
                u.username as owner_username, u.profile_image as owner_image
         FROM recent_views rv
         JOIN products p ON rv.product_id = p.id
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN users u ON p.user_id = u.id
         WHERE rv.user_id = $1 AND p.status = 'active' AND p.is_available = true
         ORDER BY rv.viewed_at DESC
         LIMIT $2`,
        [userId, limit]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to get recent views: ' + error.message);
    }
  }

  // Get most viewed products in last N days
  static async getTrendingProducts(days = 7, limit = 10) {
    try {
      const result = await db.query(
        `SELECT p.id, p.title, p.description, p.condition, p.original_price, 
                p.images, p.location, p.view_count,
                COUNT(rv.id) as recent_views,
                c.name as category_name, c.icon as category_icon
         FROM products p
         LEFT JOIN recent_views rv ON p.id = rv.product_id 
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE rv.viewed_at > CURRENT_DATE - INTERVAL '${days} days'
               AND p.status = 'active' AND p.is_available = true
         GROUP BY p.id, c.name, c.icon
         ORDER BY recent_views DESC, p.view_count DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to get trending products: ' + error.message);
    }
  }

  // Clear old views (keep only last N views per user)
  static async clearOldViews(userId, keepLast = 50) {
    try {
      const result = await db.query(
        `DELETE FROM recent_views 
         WHERE user_id = $1 
         AND id NOT IN (
           SELECT id FROM recent_views 
           WHERE user_id = $1 
           ORDER BY viewed_at DESC 
           LIMIT $2
         )
         RETURNING *`,
        [userId, keepLast]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to clear old views: ' + error.message);
    }
  }

  // Check if user has viewed a product
  static async hasUserViewed(userId, productId) {
    try {
      const result = await db.query(
        'SELECT id FROM recent_views WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw new Error('Failed to check view status: ' + error.message);
    }
  }

  // Delete a specific view
  static async removeView(userId, productId) {
    try {
      const result = await db.query(
        'DELETE FROM recent_views WHERE user_id = $1 AND product_id = $2 RETURNING *',
        [userId, productId]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to remove view: ' + error.message);
    }
  }

  static async clearAllViews(userId) {
    try { 
      const result = await db.query(
        'DELETE FROM recent_views WHERE user_id = $1 RETURNING *',
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Failed to clear all views: ' + error.message);
    }
  }

  // Get view statistics for a product
  static async getProductViewStats(productId) {
    try {
      const result = await db.query(
        `SELECT COUNT(*) as total_views,
                COUNT(DISTINCT user_id) as unique_viewers,
                MAX(viewed_at) as last_viewed,
                MIN(viewed_at) as first_viewed
         FROM recent_views 
         WHERE product_id = $1`,
        [productId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to get view stats: ' + error.message);
    }
  }
}

module.exports = RecentView;