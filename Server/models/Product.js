const db = require('../db');

class Product {
  static async findById(id) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name, u.profile_image as seller_image
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.user_id = u.id 
       WHERE p.id = $1`,
      [id]
    );
    
    if (result.rows[0]) {
      // Get wanted items for this swap
      const wantedItemsResult = await db.query(
        `SELECT * FROM wanted_items WHERE product_id = $1 ORDER BY priority ASC`,
        [id]
      );
      result.rows[0].wanted_items = wantedItemsResult.rows;
    }
    
    return result.rows[0] || null;
  }

  static async findByUserHistory(userId) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.user_id = $1 AND p.is_available = false
      ORDER BY p.created_at DESC`,
      [userId]
    );

    for (const product of result.rows) {
      const swapResult = await db.query(
        `SELECT * FROM swaps WHERE product_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [product.id]
      );

      const swap = swapResult.rows[0];
      if (swap) {
        const offerResult = await db.query(
          `SELECT * FROM offers WHERE id = $1 ORDER BY created_at DESC LIMIT 1`,
          [swap.offer_id]
        );

        const offer = offerResult.rows[0];
        product.latest_swap = swap;
        product.latest_offer = offer;
      }
    }

    return result.rows;
  }

  static async findByUserlistings(userId){
    const result = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.user_id = $1 AND p.is_available = true
       ORDER BY p.created_at DESC`,
      [userId]
    );
    
    return result.rows;
  }

  static async findByUserlistingsdone(userId){
    const result = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.user_id = $1 AND p.is_available = false
       ORDER BY p.created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  static async findByCategory(categoryId, limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name, u.profile_image as seller_image
       FROM prodcuts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.user_id = u.id 
       WHERE p.category_id = $1 AND p.is_available = true 
       ORDER BY p.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [categoryId, limit, offset]
    );
    
    // Get wanted items for each swap
    for (let swap of result.rows) {
      const wantedItemsResult = await db.query(
        `SELECT * FROM wanted_items WHERE product_id = $1 ORDER BY priority ASC`,
        [swap.id]
      );
      swap.wanted_items = wantedItemsResult.rows;
    }
    
    return result.rows;
  }

  static async findAll(limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name, u.profile_image as seller_image
       FROM prodcuts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.user_id = u.id 
       WHERE p.is_available = true 
       ORDER BY p.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    return result.rows;
  }

  static async findAllHome(userId, limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name, u.profile_image as seller_image
       FROM prodcuts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.user_id = u.id 
       WHERE p.is_available = true AND user_Id != $1
       ORDER BY p.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    
    return result.rows;
  }

  static async search(query, limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name, u.profile_image as seller_image
       FROM prodcuts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.user_id = u.id 
       WHERE p.is_available = true 
       AND (p.title ILIKE $1 OR p.description ILIKE $1) 
       ORDER BY p.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [`%${query}%`, limit, offset]
    );
    
    // Get wanted items for each swap
    for (let swap of result.rows) {
      const wantedItemsResult = await db.query(
        `SELECT * FROM wanted_items WHERE product_id = $1 ORDER BY priority ASC`,
        [swap.id]
      );
      swap.wanted_items = wantedItemsResult.rows;
    }
    
    return result.rows;
  }

  static async create(swapData) {
    const { 
      user_id, title, description, category_id, condition, original_price, 
      tags, images, wanted_category_id, wanted_condition, wanted_price_range,
      additional_notes, swap_preference, negotiable, location, wanted_items 
    } = swapData;
    
    // Start transaction
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert swap
      const swapResult = await client.query(
        `INSERT INTO products (
          user_id, title, description, category_id, condition, original_price,
          tags, images, wanted_category_id, wanted_condition, wanted_price_range,
          additional_notes, swap_preference, negotiable, location
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING *`,
        [
          user_id, title, description, category_id, condition, original_price,
          tags, images, wanted_category_id, wanted_condition, wanted_price_range,
          additional_notes, swap_preference, negotiable, location
        ]
      );
      
      const swap = swapResult.rows[0];
      
      // Insert wanted items
      if (wanted_items && wanted_items.length > 0) {
        for (let i = 0; i < wanted_items.length; i++) {
          const item = wanted_items[i];
          await client.query(
            `INSERT INTO wanted_items (product_id, item_name, description, priority) 
             VALUES ($1, $2, $3, $4)`,
            [swap.id, item.name, item.description, i + 1]
          );
        }
      }
      
      await client.query('COMMIT');
      
      // Return the created swap with wanted items
      return await this.findById(swap.id);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, updateData) {
    const { 
      title, description, category_id, condition, original_price, tags, images,
      wanted_category_id, wanted_condition, wanted_price_range, additional_notes,
      swap_preference, negotiable, location, is_available, wanted_items 
    } = updateData;
    
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update swap
      const swapResult = await client.query(
        `UPDATE products 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             category_id = COALESCE($3, category_id),
             condition = COALESCE($4, condition),
             original_price = COALESCE($5, original_price),
             tags = COALESCE($6, tags),
             images = COALESCE($7, images),
             wanted_category_id = COALESCE($8, wanted_category_id),
             wanted_condition = COALESCE($9, wanted_condition),
             wanted_price_range = COALESCE($10, wanted_price_range),
             additional_notes = COALESCE($11, additional_notes),
             swap_preference = COALESCE($12, swap_preference),
             negotiable = COALESCE($13, negotiable),
             location = COALESCE($14, location),
             is_available = COALESCE($15, is_available),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $16 
         RETURNING *`,
        [
          title, description, category_id, condition, original_price, tags, images,
          wanted_category_id, wanted_condition, wanted_price_range, additional_notes,
          swap_preference, negotiable, location, is_available, id
        ]
      );
      
      // Update wanted items if provided
      if (wanted_items) {
        // Delete existing wanted items
        await client.query('DELETE FROM wanted_items WHERE product_id = $1', [id]);
        
        // Insert new wanted items
        for (let i = 0; i < wanted_items.length; i++) {
          const item = wanted_items[i];
          await client.query(
            `INSERT INTO wanted_items (product_id, item_name, description, priority) 
             VALUES ($1, $2, $3, $4)`,
            [id, item.name, item.description, i + 1]
          );
        }
      }
      
      await client.query('COMMIT');
      
      // Return the updated swap with wanted items
      return await this.findById(id);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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

  static async findHomeProducts(limit, offset, filters = {}) {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.discount_price,
        p.image_url,
        p.category_id,
        p.user_id,
        p.stock_quantity,
        p.rating,
        p.review_count,
        p.is_featured,
        p.created_at,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        u.username as seller_name,
        u.profile_image as seller_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = $1
    `;
    
    const queryParams = ['active'];
    let paramIndex = 2;
    
    // Apply category filter
    if (filters.category_id) {
      query += ` AND p.category_id = ${paramIndex}`;
      queryParams.push(filters.category_id);
      paramIndex++;
    }
    
    // Apply search filter
    if (filters.search) {
      query += ` AND (
        LOWER(p.name) ILIKE ${paramIndex} OR 
        LOWER(p.description) ILIKE ${paramIndex} OR
        LOWER(c.name) ILIKE ${paramIndex}
      )`;
      queryParams.push(`%${filters.search.toLowerCase()}%`);
      paramIndex++;
    }
    
    // Order by featured products first, then by rating, then by newest
    query += `
      ORDER BY 
        p.is_featured DESC,
        p.rating DESC,
        p.created_at DESC
      LIMIT ${paramIndex} OFFSET ${paramIndex + 1}
    `;
    
    queryParams.push(limit, offset);
    
    const result = await db.query(query, queryParams);
    return result.rows;
  }
  
  // Find all products with filters (more general purpose)
  static async findAllWithFilters(limit, offset, filters = {}) {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.discount_price,
        p.image_url,
        p.category_id,
        p.user_id,
        p.stock_quantity,
        p.rating,
        p.review_count,
        p.status,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        u.username as seller_name,
        u.profile_image as seller_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    // Apply status filter
    if (filters.status) {
      query += ` AND p.status = ${paramIndex}`;
      queryParams.push(filters.status);
      paramIndex++;
    }
    
    // Apply category filter
    if (filters.category_id) {
      query += ` AND p.category_id = ${paramIndex}`;
      queryParams.push(filters.category_id);
      paramIndex++;
    }
    
    // Apply search filter
    if (filters.search) {
      query += ` AND (
        LOWER(p.name) ILIKE ${paramIndex} OR 
        LOWER(p.description) ILIKE ${paramIndex}
      )`;
      queryParams.push(`%${filters.search.toLowerCase()}%`);
      paramIndex++;
    }
    
    // Apply price range filter (optional)
    if (filters.min_price) {
      query += ` AND p.price >= ${paramIndex}`;
      queryParams.push(filters.min_price);
      paramIndex++;
    }
    
    if (filters.max_price) {
      query += ` AND p.price <= ${paramIndex}`;
      queryParams.push(filters.max_price);
      paramIndex++;
    }
    
    // Apply rating filter (optional)
    if (filters.min_rating) {
      query += ` AND p.rating >= ${paramIndex}`;
      queryParams.push(filters.min_rating);
      paramIndex++;
    }
    
    // Apply stock filter (optional)
    if (filters.in_stock) {
      query += ` AND p.stock_quantity > 0`;
    }
    
    // Default ordering
    query += `
      ORDER BY p.created_at DESC
      LIMIT ${paramIndex} OFFSET ${paramIndex + 1}
    `;
    
    queryParams.push(limit, offset);
    
    const result = await db.query(query, queryParams);
    return result.rows;
  }
  
  // Get total count for pagination
  static async getProductCount(filters = {}) {
    let query = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    // Apply same filters as findAllWithFilters
    if (filters.status) {
      query += ` AND p.status = ${paramIndex}`;
      queryParams.push(filters.status);
      paramIndex++;
    }
    
    if (filters.category_id) {
      query += ` AND p.category_id = ${paramIndex}`;
      queryParams.push(filters.category_id);
      paramIndex++;
    }
    
    if (filters.search) {
      query += ` AND (
        LOWER(p.name) ILIKE ${paramIndex} OR 
        LOWER(p.description) ILIKE ${paramIndex}
      )`;
      queryParams.push(`%${filters.search.toLowerCase()}%`);
      paramIndex++;
    }
    
    if (filters.min_price) {
      query += ` AND p.price >= ${paramIndex}`;
      queryParams.push(filters.min_price);
      paramIndex++;
    }
    
    if (filters.max_price) {
      query += ` AND p.price <= ${paramIndex}`;
      queryParams.push(filters.max_price);
      paramIndex++;
    }
    
    if (filters.min_rating) {
      query += ` AND p.rating >= ${paramIndex}`;
      queryParams.push(filters.min_rating);
      paramIndex++;
    }
    
    if (filters.in_stock) {
      query += ` AND p.stock_quantity > 0`;
    }
    
    const result = await db.query(query, queryParams);
    return parseInt(result.rows[0].total);
  }

}

module.exports = Product; 