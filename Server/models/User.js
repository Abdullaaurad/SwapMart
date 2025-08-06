const db = require('../db');
const bcrypt = require('bcrypt');

class User {
  static async findByUsername(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async getUserHeader(userId){
    const result = await db.query(
      'SELECT fullName , profile_image, FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] || null;
  }

  static async create(username, password) {
    // Validate password length
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Check if username already exists
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    return result.rows[0];
  }

  static async authenticate(username, password) {
    // Validate password length
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Find user by username
    const user = await this.findByUsername(username);
    if (!user) {
      throw new Error('Username does not exist');
    }

    // Verify password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    return user;
  }

  static async updateOnboardStatus(userId, onboardStatus) {
    const result = await db.query(
      'UPDATE users SET onboard = $1 WHERE id = $2 RETURNING *',
      [onboardStatus, userId]
    );
    return result.rows[0];
  }

  static async getUserProfile(userId) {
    const result = await db.query(
      'SELECT username, fullName, email, phone, profile_image, bio, location, latitude, longitude FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] || null;
  }

  static async updateProfile(userId, profileData) {
    const { email, phone, profile_image, bio, location, latitude, longitude } = profileData;
    
    const result = await db.query(
      `UPDATE users 
       SET email = COALESCE($1, email),
           phone = COALESCE($2, phone),
           profile_image = COALESCE($3, profile_image),
           bio = COALESCE($4, bio),
           location = COALESCE($5, location),
           latitude = COALESCE($6, latitude),
           longitude = COALESCE($7, longitude),
           onboard = true,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [email, phone, profile_image, bio, location, latitude, longitude, userId]
    );
    
    return result.rows[0];
  }

  static async updatePassword(userId, newPassword) {
    
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const result = await db.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING *',
      [hashedPassword, userId]
    );
    return "success";
  }
}

module.exports = User; 