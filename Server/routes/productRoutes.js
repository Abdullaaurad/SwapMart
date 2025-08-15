const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/swaps/search', productController.searchProducts);
router.get('/swaps/category/:categoryId', productController.getProductsByCategory);

router.get('/my-listings', authenticateToken ,productController.getMyProductsListings);
router.get('/listing-history', authenticateToken , productController.getListingHistory);
router.get('/my-product/:id', authenticateToken, productController.getMyProductsById);
router.get('/product/:id', authenticateToken, productController.getProductsById);
router.delete('/:id', authenticateToken, productController.deleteProduct);
router.get('/home', authenticateToken, productController.getHomeProducts);

module.exports = router;