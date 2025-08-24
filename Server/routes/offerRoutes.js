// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const offerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../Uploads/Offer'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E4);
    cb(null, 'offer_' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadOffer = multer({ storage: offerStorage });

router.get('/my-offers', authenticateToken, offerController.getOffer);
router.post('/create', authenticateToken, offerController.createOffer);
router.post('/upload-image', authenticateToken, uploadOffer.single('image'), offerController.uploadOfferImage);
router.put('/:id',authenticateToken, offerController.changeStatus);

module.exports = router;