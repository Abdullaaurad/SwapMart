const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/swaps', productController.getAllProducts);
router.get('/swaps/search', productController.searchProducts);
router.get('/swaps/category/:categoryId', productController.getProductsByCategory);
router.get('/swaps/:id', productController.getProductsById);

router.get('/my-listings', authenticateToken ,productController.getMyProductsListings);
router.post('/listing-history', authenticateToken , productController.getListingHistory);
router.put('/swaps/:id', productController.updateProduct);
router.delete('/swaps/:id', productController.deleteProduct);

module.exports = router;