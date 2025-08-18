// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateSignUp, validateLogin, validateProfileUpdate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../Helper/fileUpload');

router.post('/signup', validateSignUp, userController.createUser);
router.post('/login', validateLogin, userController.loginUser);
router.post('/onboard', authenticateToken, userController.onboardUser);
router.get('/Header', authenticateToken, userController.getUserHeader)
router.get('/Profile', authenticateToken, userController.getUserProfile)
router.put('/update-profile', authenticateToken, validateProfileUpdate, userController.updateProfile);
router.post('/Logout', authenticateToken, userController.logoutUser);
router.post('/reset-password', authenticateToken, userController.resetPassword);
router.post('/delegate-account', authenticateToken, userController.delegateAccount);

module.exports = router;