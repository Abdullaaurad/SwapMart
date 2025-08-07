const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const products = await Product.findAll(limit, offset);
    return res.status(200).json({
      success: true,
      products: products
    });
  } catch (err) {
    console.error('Error fetching swaps:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getProductsById = async (req, res) => {
  const productId = req.params.id;
  try {
    const products = await Product.findById(productId);
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }
    return res.status(200).json({
      success: true,
      products: products
    });
  } catch (err) {
    console.error('Error fetching swap:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getMyProductsListings = async (req, res) => {
  const userId = req.user.id;
  try {
    const products = await Product.findByUserlistings(userId);
    console.log("products:",  products);
    return res.status(200).json({
      success: true,
      products: products
    });
  } catch (err) {
    console.error('Error fetching user swaps:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getListingHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const products = await Product.findByUserlistings(userId);
    console.log("products:",  products);
    return res.status(200).json({
      success: true,
      products: products
    });
  } catch (err) {
    console.error('Error fetching user swaps:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.createProduct = async (req, res) => {
  const userId = req.user.id; // Get userId from authenticated token
  const {
    title, description, category, condition, originalPrice, tags, images,
    wantedItems, wantedCategory, wantedCondition, wantedPriceRange,
    additionalNotes, swapPreference, negotiable, location
  } = req.body;

  // Validation
  if (!title || !description || !category || !condition) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, category, and condition are required'
    });
  }

  if (!wantedItems || wantedItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one wanted item is required'
    });
  }

  try {
    // Transform wanted items to match database structure
    const wantedItemsFormatted = wantedItems.map((item, index) => ({
      name: item,
      description: null,
      priority: index + 1
    }));

    const swapData = {
      user_id: userId,
      title,
      description,
      category_id: category,
      condition,
      original_price: originalPrice || null,
      tags: tags || [],
      images: images || [],
      wanted_category_id: wantedCategory || null,
      wanted_condition: wantedCondition || null,
      wanted_price_range: wantedPriceRange || null,
      additional_notes: additionalNotes || null,
      swap_preference: swapPreference || 'local',
      negotiable: negotiable !== undefined ? negotiable : true,
      location: location || null,
      wanted_items: wantedItemsFormatted
    };

    const newProduct = await Product.create(swapData);

    return res.status(201).json({
      success: true,
      product: newProduct
    });
  } catch (err) {
    console.error('Error creating swap:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const product = await Product.findById(swapId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (product.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this swap'
      });
    }

    // Transform wanted items if provided
    if (updateData.wantedItems) {
      updateData.wanted_items = updateData.wantedItems.map((item, index) => ({
        name: item,
        description: null,
        priority: index + 1
      }));
      delete updateData.wantedItems;
    }

    const updatedSwap = await roduct.update(productId, updateData);

    return res.status(200).json({
      success: true,
      product: updatedSwap
    });
  } catch (err) {
    console.error('Error updating swap:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;

  try {
    const swap = await Swap.findById(productId);
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (swap.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this swap'
      });
    }

    await Product.delete(swapId);
    return res.status(200).json({
      success: true,
      message: 'Swap deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting swap:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.searchProducts = async (req, res) => {
  const { q, limit = 20, offset = 0 } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  try {
    const products = await Product.search(q, parseInt(limit), parseInt(offset));
    return res.status(200).json({
      success: true,
      products: products
    });
  } catch (err) {
    console.error('Error searching swaps:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getProductsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const products = await Product.findByCategory(categoryId, limit, offset);
    return res.status(200).json({
      success: true,
      products: products
    });
  } catch (err) {
    console.error('Error fetching swaps by category:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 