const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Received user data:', req.body);
  
  try {
    // Create user using the model
    const user = await User.create(username, password);
    
    console.log('User created successfully:', user.username);
    
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        onboard: user.onboard
      }
    });
    
  } catch (err) {
    console.error('User creation error:', err);
    
    // Handle specific validation errors
    if (err.message === 'Username already exists') {
      return res.status(409).json({ 
        success: false, 
        row: 'username', 
        message: err.message 
      });
    }
    
    if (err.message === 'Password must be at least 6 characters long') {
      return res.status(400).json({ 
        success: false, 
        row: 'password', 
        message: err.message 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Received user data:', req.body);
  
  try {    // Authenticate user using the model
    const user = await User.authenticate(username, password);
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '2h' });
    
    console.log('User logged in with username:', username);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        onboard: user.onboard || false,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    
    // Handle specific authentication errors
    if (err.message === 'Username does not exist') {
      return res.status(401).json({ 
        success: false, 
        row: 'username', 
        message: err.message 
      });
    }
    
    if (err.message === 'Incorrect password') {
      return res.status(401).json({ 
        success: false, 
        row: 'password', 
        message: err.message 
      });
    }
    
    if (err.message === 'Password must be at least 6 characters long') {
      return res.status(400).json({ 
        success: false, 
        row: 'password', 
        message: err.message 
      });
    }
    
    // Handle other errors
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

exports.onboardUser = async (req, res) => {
  const { email, phone, profile_image, bio, location, latitude, longitude } = req.body;
  const userId = req.user.id; // Get userId from authenticated user
  console.log('Received onboard data:', req.body);

  try {
    // Validate required fields
    if (!email || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, phone, location'
      });
    }

    // Check if user exists (already verified by auth middleware)
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user profile
    const updatedUser = await User.updateProfile(userId, {
      email,
      phone,
      profile_image,
      bio,
      location,
      latitude,
      longitude
    });

    console.log('User onboarded successfully:', updatedUser.username);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        onboard: updatedUser.onboard
      }
    });

  } catch (err) {
    console.error('Onboarding error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getUserHeader = async (req, res) => {
  const userId = req.user.id; // Get userId from authenticated token
  console.log('Fetching header for user ID:', userId);

  try {
    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User header fetched successfully:', user.username);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        profile_image: user.profile_image,
      }
    });

  } catch (err) {
    console.error('Error fetching user header:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id; // Get userId from authenticated token
  console.log('Fetching profile for user ID:', userId);

  try {
    const user = await User.getUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User profile fetched successfully:', user.username);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullname,
        email: user.email,
        phone: user.phone,
        profile_image: user.profile_image,
        bio: user.bio,
        location: user.location,
        latitude: user.latitude,
        longitude: user.longitude,
      }
    });

  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.logoutUser = async (req, res) => {
  const userId = req.user.id; // Get userId from authenticated token
  console.log('Logging out user ID:', userId);

  try {
    console.log('User logged out successfully:', userId);
    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (err) {
    console.error('Error logging out user:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const userId = req.user.id; // Get userId from authenticated token
  console.log('Resetting password for user ID:', userId);

  try {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Update password
    const updatedUser = await User.updatePassword(userId, newPassword);
    console.log('Password reset successfully for user:', updatedUser.username);

    return res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (err) {
    console.error('Error resetting password:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}