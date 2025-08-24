const { Swap } = require('../models');
const { Offer } = require('../models');
const { Product } = require('../models');
const { User } = require('../models');

exports.getSwapById = async (req, res) => {
  const swapId = req.params.id;
  try {
    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap not found' });
    }

    // Get product details
    const product = await Product.findById(swap.product_id);
    // Get offer details
    const offer = await Offer.findById(swap.offer_id);

    // Get owner and buyer details
    const owner = product ? await User.findById(product.user_id) : null;
    const buyer = offer ? await User.findById(offer.buyer_id) : null;

    // Build full image URLs
    const product_images = Array.isArray(product?.images)
      ? product.images.map(img =>
          typeof img === 'string'
            ? `${req.protocol}://${req.get('host')}/Uploads/Product/${img}`
            : `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url || img}`
        )
      : [];
    const offered_item_images = Array.isArray(offer?.offered_item_images)
      ? offer.offered_item_images.map(img =>
          typeof img === 'string'
            ? `${req.protocol}://${req.get('host')}/Uploads/Product/${img}`
            : `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url || img}`
        )
      : [];

    // Compose swap details for frontend
    const swapDetails = {
      ...swap,
      product_title: product?.title || '',
      product_description: product?.description || '',
      product_condition: product?.condition || 'N/A',
      product_images,
      offered_item_title: offer?.offered_item_title || '',
      offered_item_description: offer?.offered_item_description || '',
      offered_item_condition: offer?.offered_item_condition || 'N/A',
      offered_item_images,
      owner_name: owner?.fullname || '',
      owner_avatar: owner?.profile_image
        ? `${req.protocol}://${req.get('host')}/Uploads/Profile/${owner.profile_image}`
        : null,
      buyer_name: buyer?.fullname || '',
      buyer_avatar: buyer?.profile_image
        ? `${req.protocol}://${req.get('host')}/Uploads/Profile/${buyer.profile_image}`
        : null,
      status: swap.swaped ? 'Completed' : 'Pending',
    };

    return res.status(200).json({ success: true, swap: swapDetails });
  } catch (err) {
    console.error('Error fetching swap:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getSwapsForUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const swaps = await Swap.findByUser(userId);
    return res.status(200).json({ success: true, swaps });
  } catch (err) {
    console.error('Error fetching swaps:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getSwapsForProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const swaps = await Swap.findByProduct(productId);
    return res.status(200).json({ success: true, swaps });
  } catch (err) {
    console.error('Error fetching swaps:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.createSwap = async (req, res) => {
  try {
    const { product_id, offer_id } = req.body;
    if (!product_id || !offer_id) {
      return res.status(400).json({ success: false, message: 'Product ID and Offer ID required' });
    }
    const swap = await Swap.create({ product_id, offer_id });
    return res.status(201).json({ success: true, swap });
  } catch (err) {
    console.error('Error creating swap:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.markSwapCompleted = async (req, res) => {
  const swapId = req.params.id;
  try {
    const swap = await Swap.markSwaped(swapId);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap not found' });
    }
    return res.status(200).json({ success: true, swap });
  } catch (err) {
    console.error('Error marking swap as completed:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};