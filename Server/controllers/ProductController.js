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
    console.error('Error fetching products:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    return res.status(200).json({
      success: true,
      product: product
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getMyProducts = async (req, res) => {
  const userId = req.user.id; // Get userId from authenticated token
  try {
    const products = await Product.findBySeller(userId);
    return res.status(200).json({
      success: true,
      products: products
    });
  } catch (err) {
    console.error('Error fetching user products:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const userId = req.user.id; // Get userId from authenticated token

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      owner: userId
    });

    await newProduct.save();
    return res.status(201).json({
      success: true,
      product: newProduct
    });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, category } = req.body;
  const userId = req.user.id; // Get userId from authenticated token

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this product'
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    await product.save();
    return res.status(200).json({
      success: true,
      product: product
    });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id; // Get userId from authenticated token

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this product'
      });
    }

    await Product.delete(productId);
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}   

exports.soledProducts = async (req, res) => {
    const userId = req.user.id; // Get userId from authenticated token
    try {
        const products = await Product.markAsUnavailable(true);
        return res.status(200).json({
        success: true,
        products: products
        });
    } catch (err) {
        console.error('Error fetching sold products:', err);
        return res.status(500).json({
        success: false,
        message: 'Internal server error'
        });
    }
}

exports.deleteAllUserProducts = async (req, res) => {
  const userId = req.user.id; // Get userId from authenticated token
  try {
    await Product.deleteMany({ owner: userId });
    return res.status(200).json({
      success: true,
      message: 'All products deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting all user products:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

