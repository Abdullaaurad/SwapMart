const validateSignUp = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }
  
  if (username.trim().length === 0) {
    return res.status(400).json({
      success: false,
      row: 'username',
      message: 'Username cannot be empty'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      row: 'password',
      message: 'Password must be at least 6 characters long'
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }
  
  next();
};

const validateOnboarding = (req, res, next) => {
  const { userId, email, phone, location } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }
  
  if (!phone || phone.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Valid phone number is required'
    });
  }
  
  if (!location) {
    return res.status(400).json({
      success: false,
      message: 'Location is required'
    });
  }
  
  next();
};

module.exports = {
  validateSignUp,
  validateLogin,
  validateOnboarding
}; 