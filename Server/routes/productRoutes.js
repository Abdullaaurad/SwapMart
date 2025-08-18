  const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../Helper/fileUpload');

// Middleware to set folder type for product images
const setProductFolderType = (req, res, next) => {
  console.log('Setting folder type to Product');
  console.log('req.body before setting folderType:', req.body);
  console.log('req.body.folderType before setting:', req.body.folderType);
  req.body.folderType = 'Product';
  console.log('req.body.folderType after setting:', req.body.folderType);
  next();
};

// Public routes
router.get('/swaps/search', productController.searchProducts);
router.get('/swaps/category/:categoryId', productController.getProductsByCategory);

router.get('/my-listings', authenticateToken ,productController.getMyProductsListings);
router.get('/listing-history', authenticateToken , productController.getListingHistory);
router.get('/my-product/:id', authenticateToken, productController.getMyProductsById);
router.get('/product/:id', authenticateToken, productController.getProductsById);
router.delete('/:id', authenticateToken, productController.deleteProduct);
router.get('/home', authenticateToken, productController.getHomeProducts);
router.post('/create', authenticateToken, productController.createProduct);
router.post('/upload/image', authenticateToken, setProductFolderType, upload.single('image'), productController.uploadProductImage);

module.exports = router;