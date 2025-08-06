// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateSignUp, validateLogin, validateOnboarding } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

router.post('/signup', validateSignUp, userController.createUser);
router.post('/login', validateLogin, userController.loginUser);
router.post('/onboard', authenticateToken, validateOnboarding, userController.onboardUser);
router.get('/Header', authenticateToken, userController.getUserHeader)
router.get('/Profile', authenticateToken, userController.getUserProfile)
router.post('/Logout', authenticateToken, userController.logoutUser);
router.post('/reset-password', authenticateToken, userController.resetPassword);

module.exports = router;