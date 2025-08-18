const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { handleSingleUpload, deleteFile } = require('../Helper/fileUpload');

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
  console.log("Onboard User is called");
  try {
    // Set folder type before processing upload
    req.body.folderType = 'Profile';
    console.log(req.body)
    
    // Handle file upload first (if profile image is provided)
    let fileInfo = null;
    try {
      fileInfo = await handleSingleUpload(req, res, 'profile_image');
    } catch (uploadError) {
      return res.status(uploadError.statusCode || 400).json(uploadError);
    }

    const { fullname, email, phone, bio, location, latitude, longitude } = req.body;
    const userId = req.user.id; // Get userId from authenticated user
    console.log("User Id =", userId);
    
    console.log('Received onboard data:', req.body);
    console.log('Uploaded file info:', fileInfo);

    // Validate required fields
    if (!fullname) {
      // If file was uploaded but validation fails, clean up
      if (fileInfo) {
        deleteFile(fileInfo.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Full name is required'
      });
    }
    
    if (!email || !email.includes('@')) {
      // If file was uploaded but validation fails, clean up
      if (fileInfo) {
        deleteFile(fileInfo.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }
    
    if (!phone || phone.length < 10) {
      // If file was uploaded but validation fails, clean up
      if (fileInfo) {
        deleteFile(fileInfo.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Valid phone number is required'
      });
    }
    
    if (!location) {
      // If file was uploaded but validation fails, clean up
      if (fileInfo) {
        deleteFile(fileInfo.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }

    // Check if user exists (already verified by auth middleware)
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      // Clean up uploaded file if user not found
      if (fileInfo) {
        deleteFile(fileInfo.path);
      }
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get profile image path if file was uploaded
    let profile_image = null;
    if (fileInfo) {
      profile_image = fileInfo.filename; // Store only the filename, not the full URL
    }

    // Update user profile
    const updatedUser = await User.updateProfile(userId, {
      fullname,
      email,
      phone,
      profile_image,
      bio,
      location,
      latitude,
      longitude
    });

    console.log('User onboarded successfully:', updatedUser.username);

    // Construct full URL for profile image if it exists
    let profileImageUrl = null;
    if (updatedUser.profile_image) {
      profileImageUrl = `${req.protocol}://${req.get('host')}/Uploads/Profile/${updatedUser.profile_image}`;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        profile_image: profileImageUrl, // Send full URL to client
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

exports.updateProfile = async (req, res) => {
  const { fullname, email, phone, profile_image, bio, location, latitude, longitude } = req.body;
  const userId = req.user.id;
  console.log('Updating profile for user ID:', userId);

  try {
    // Validate required fields
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email and phone number are required'
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

    // Update user profile (store only filename, not full URL)
    const updatedUser = await User.updateProfile(userId, {
      fullname,
      email,
      phone,
      profile_image: profile_image ? profile_image.split('/').pop() : null, // Extract filename from URL if needed
      bio,
      location,
      latitude,
      longitude
    });

    console.log('Profile updated successfully for user:', updatedUser.username);

    // Construct full URL for profile image if it exists
    let profileImageUrl = null;
    if (updatedUser.profile_image) {
      profileImageUrl = `${req.protocol}://${req.get('host')}/Uploads/Profile/${updatedUser.profile_image}`;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profile_image: profileImageUrl, // Send full URL to client
        bio: updatedUser.bio,
        location: updatedUser.location,
        latitude: updatedUser.latitude,
        longitude: updatedUser.longitude,
        onboard: updatedUser.onboard
      }
    });

  } catch (err) {
    console.error('Profile update error:', err);
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

    // Construct full URL for profile image if it exists
    let profileImageUrl = null;
    if (user.profile_image) {
      profileImageUrl = `${req.protocol}://${req.get('host')}/Uploads/Profile/${user.profile_image}`;
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullname: user.fullname,
        profile_image: profileImageUrl, // Send full URL to client
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

    // Construct full URL for profile image if it exists
    let profileImageUrl = null;
    if (user.profile_image) {
      profileImageUrl = `${req.protocol}://${req.get('host')}/Uploads/Profile/${user.profile_image}`;
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        profile_image: profileImageUrl, // Send full URL to client
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

exports.delegateAccount = async (req, res) => {
  const userId = req.user.id; // Get userId from authenticated token
  console.log('Delegating account for user ID:', userId);

  try {
    // Delegate account logic (this is a placeholder, implement as needed)
    const result = await User.delegateAccount(userId);
    
    console.log('Account delegated successfully for user:', userId);

    return res.status(200).json({
      success: true,
      message: 'Account delegated successfully',
      result
    });

  } catch (err) {
    console.error('Error delegating account:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}