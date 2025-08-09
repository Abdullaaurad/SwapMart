const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {authenticateToken} = require('../middleware/auth');

router.get('/findall', authenticateToken, categoryController.getAllCategories);