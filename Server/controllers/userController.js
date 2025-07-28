const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { username, password  } = req.body;
  console.log('Received user data:', req.body);
  try {
    if (!username || !password) {
      return res.status(500).json({ success: false,  message: 'Username and password are required' });
    }
    const existingUser = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(500).json({ success: false, row:'username', message: 'Username already exists' });
    }
    console.log('Creating user with username:', username);
    if( password.length < 6) {
      return res.status(500).json({ success: false, row: 'password' ,message: 'Password must be at least 6 characters long' });
    }
    const hash = require('bcrypt').hashSync(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hash]
    );
    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password  } = req.body;
  console.log('Received user data:', req.body);
  try {
    if (!username || !password) {
      return res.status(500).json({ success: false,  message: 'Username and password are required' });
    }
    const existingUser = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length === 0) {
      return res.status(500).json({ success: false, row: 'username', message: 'Username does not exist' });
    }
    const user = existingUser.rows[0];
    if (password.length < 6) {
      return res.status(500).json({ success: false, row: 'password', message: 'Password must be at least 6 characters long' });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(501).json({ success: false, row: 'password', message: 'Incorrect password' });
    }
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    console.log('User logged in with username:', username);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userId: user.id,
      onboard: user.onboard || false,
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};