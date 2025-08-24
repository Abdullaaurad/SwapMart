// controllers/productController.js
const { Product } = require('../models');
const { Wanted } = require('../models');
const { Offer } = require('../models');
const { Swap } = require('../models')
const { User } = require('../models');
const { handleSingleUpload } = require('../Helper/fileUpload');

// Existing functions (keeping as-is)
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

exports.getProductsById = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required'
    });
  }
  else{
    try {
      const products = await Product.findById(productId);
      if (!products) {
        return res.status(404).json({
          success: false,
          message: 'product not found'
        });
      }
      else{
        const wantedItemsResult = await Wanted.getByProductId(productId);
        console.log("wanted Items :", wantedItemsResult)
        products.wanted_items = wantedItemsResult

        const productWithImageUrls = {
          ...products,
          images: Array.isArray(products.images)
            ? products.images.map(img => ({
                ...img,
                url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url}`
              }))
            : []
        };

        return res.status(200).json({
          success: true,
          products: productWithImageUrls
        });
        
      }
    }
    catch (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

exports.getMyProductsById = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;
  
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required'
    });
  }

  try {
    const products = await Product.findById(productId);
    
    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (products.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this product'
      });
    }

    // Process product images
    let productWithImageUrls = {
      ...products._doc || products, // Use _doc for Mongoose documents
      images: Array.isArray(products.images)
        ? products.images.map(img => ({
            ...img,
            url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url || img}`
          }))
        : []
    };

    // Get wanted items
    const wantedItemsResult = await Wanted.getByProductId(productId);
    console.log("wanted Items:", wantedItemsResult);
    productWithImageUrls.wanted_items = wantedItemsResult;

    // Get offers and process their images
    const offers = await Offer.findByProduct(productId);
    
    // Process offers to include full image URLs
    const processedOffers = Array.isArray(offers) 
      ? offers.map(offer => ({
          ...offer._doc || offer,
          offered_item_images: Array.isArray(offer.offered_item_images)
            ? offer.offered_item_images.map(img => {
                // If img is just a string (filename)
                if (typeof img === 'string') {
                  return `${req.protocol}://${req.get('host')}/Uploads/Product/${img}`;
                }
                // If img is an object with url property
                return {
                  ...img,
                  url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url || img}`
                };
              })
            : []
        }))
      : [];

    productWithImageUrls.offers = processedOffers;

    return res.status(200).json({
      success: true,
      product: productWithImageUrls // Changed from 'products' to 'product' since it's a single item
    });

  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Image upload function for products
exports.uploadProductImage = async (req, res) => {
  try {
    console.log('uploadProductImage - req.file:', req.file);
    console.log('uploadProductImage - req.body:', req.body);
    console.log('uploadProductImage - req.body.folderType:', req.body.folderType);
    console.log('uploadProductImage - typeof req.body.folderType:', typeof req.body.folderType);
    // The file is already uploaded by the middleware
    if (req.file) {
      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        filename: req.file.filename, // Return just the filename
        path: req.file.path,
        size: req.file.size
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
  } catch (error) {
    console.error('Product image upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.getMyProductsListings = async (req, res) => {
  const userId = req.user.id;
  try {
    const products = await Product.findByUserlistings(userId);
    console.log("products:",  products);

    const productsWithImageUrls = products.map(product => ({
      ...product,
      images: Array.isArray(product.images)
        ? product.images.map(img => ({
            ...img,
            url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url}`
          }))
        : []
    }));

    return res.status(200).json({
      success: true,
      products: productsWithImageUrls
    });
  } catch (err) {
    console.error('Error fetching user productss:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getListingHistory = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const products = await Product.findByUserlistingsdone(userId);
    
    const enrichedProducts = [];
    
    for (let product of products) {
      console.log("Product:", product);
      
      // Get swap data for this product
      const swapData = await Swap.findByProductOne(product.id);
      console.log("Swap Data: ", swapData);
      
      // Get the accepted offer that led to this swap
      const acceptedOffer = await Offer.findById(swapData.offer_id);
      console.log("Offer id =", acceptedOffer.offer_id);
      console.log('Offer: ', acceptedOffer);
      
      // Get user details
      const userDetails = await User.findById(acceptedOffer.buyer_id);
      console.log("User Details: ", userDetails);
      
      // Process product images (my item)
      const processedProductImages = Array.isArray(product.images)
        ? product.images.map(img =>
            `${req.protocol}://${req.get('host')}/Uploads/Product/${typeof img === 'string' ? img : img.url}`
          )
        : [];

      const processedOfferImages = Array.isArray(acceptedOffer.offered_item_images)
        ? acceptedOffer.offered_item_images.map(img =>
            `${req.protocol}://${req.get('host')}/Uploads/Product/${typeof img === 'string' ? img : img.url}`
          )
        : [];

      const enrichedProduct = {
        id: product.id,
        swapId: swapData.id,
        swapPartner: userDetails.fullname,
        completedDate: new Date(swapData.updated_at),
        partnerAvatar: userDetails.profile_image
          ? `${req.protocol}://${req.get('host')}/Uploads/Profile/${userDetails.profile_image}`
          : null,
        myItem: {
          name: product.title,
          image: processedProductImages,
          description: product.description,
          condition: product.condition || 'N/A'
        },
        receivedItem: {
          name: acceptedOffer.offered_item_title,
          image: processedOfferImages,
          description: acceptedOffer.offered_item_description,
          condition: acceptedOffer.offered_item_condition || 'N/A'
        }
      };
      
      enrichedProducts.push(enrichedProduct);
    }
    
    return res.status(200).json({
      success: true,
      products: enrichedProducts
    });
    
  } catch (err) {
    console.error('Error fetching user products:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.createProduct = async (req, res) => {
  const userId = req.user.id; // Get userId from authenticated token
  console.log('createProduct - req.body:', req.body);
  console.log('createProduct - typeof req.body:', typeof req.body);
  const {
    title, description, category, condition, originalPrice, tags,
    wantedItems, wantedCategory, wantedCondition, wantedPriceRange,
    additionalNotes, swapPreference, negotiable, location
  } = req.body;

  const wantedItemsFormatted = Array.isArray(wantedItems)
  ? wantedItems.map((item, index) => ({
      name: item.name || item, // handle both object and string
      description: item.description || null,
      priority: item.priority || index + 1
    }))
  : [];

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
    // console.log('createProduct - req.files:', req.files);
    // console.log('createProduct - req.body.images:', req.body.images);
    // console.log('createProduct - typeof req.body.images:', typeof req.body.images);
    // Handle image uploads if any
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      // Transform uploaded files to match database structure
      uploadedImages = req.files.map(file => ({
        url: file.filename, // Store only filename, not full URL
        alt: file.originalname
      }));
    } else if (req.body.images) {
          // If images were already uploaded separately, use those
          try {
            // Check if req.body.images is already an array of objects
            if (Array.isArray(req.body.images)) {
              uploadedImages = req.body.images.map(img => ({
                url: typeof img.url === 'string' ? img.url.split('/').pop() : img.url,
                alt: img.alt || ''
              }));
            } else {
              // Try to parse as JSON string
              const parsedImages = JSON.parse(req.body.images);
              uploadedImages = parsedImages.map(img => ({
                url: typeof img.url === 'string' ? img.url.split('/').pop() : img.url,
                alt: img.alt || ''
              }));
            }
          } catch (e) {
            // If images is not JSON and not an array, treat it as a single image filename
            if (typeof req.body.images === 'string') {
              uploadedImages = [{
                url: req.body.images.split('/').pop(),
                alt: ''
              }];
            } else {
              // If it's neither a string nor valid JSON, use it as is
              uploadedImages = Array.isArray(req.body.images) ? req.body.images : [];
            }
          }
        }

    const productsData = {
      user_id: userId,
      title,
      description,
      category_id: category,
      condition,
      original_price: originalPrice || null,
      tags: tags || [],
      images: uploadedImages,
      wanted_category_id: wantedCategory || null,
      wanted_condition: wantedCondition || null,
      wanted_price_range: wantedPriceRange || null,
      additional_notes: additionalNotes || null,
      swap_preference: swapPreference || 'local',
      negotiable: negotiable !== undefined ? negotiable : true,
      location: location || null,
    };

    // console.log('createProduct - productsData:', productsData);
    // console.log('createProduct - productsData.images:', productsData.images);
    // console.log('createProduct - typeof productsData.images:', typeof productsData.images);
    const newProduct = await Product.create(productsData);

    if (wantedItemsFormatted && Array.isArray(wantedItemsFormatted)) {
      for (const item of wantedItemsFormatted) {
        await Wanted.create({
          product_id: newProduct.id,
          item_name: item.name,
          description: item.description,
          priority: item.priority
        });
      }
    }

    // Construct full image URLs for response
    const productWithImageUrls = {
      ...newProduct,
      images: newProduct.images.map(img => ({
        ...img,
        url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url}`
      }))
    };

    return res.status(201).json({
      success: true,
      product: productWithImageUrls
    });
  } catch (err) {
    console.error('Error creating products:', err);
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
    const product = await Product.findById(productId); // Fixed typo: was productsId
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Products not found'
      });
    }

    if (product.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this products'
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

    const updatedproducts = await Product.update(productId, updateData); // Fixed typo: was roduct

    return res.status(200).json({
      success: true,
      product: updatedproducts
    });
  } catch (err) {
    console.error('Error updating products:', err);
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
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this products'
      });
    }

    await Product.delete(productId);
    return res.status(200).json({
      success: true,
      message: 'product deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting products:', err);
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
    console.error('Error searching products:', err);
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
    console.error('Error fetching products by category:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

exports.getHomeProducts = async (req, res) => {
  const userId = req.user.id;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const { search, categoryId } = req.query;

  try {
    const filters = { status: 'active' };
    if (categoryId && categoryId !== 'null') filters.category_id = parseInt(categoryId);
    if (search && search.trim()) filters.search = search.trim();

    const products = await Product.findHomeProducts(userId, limit, offset, filters);

    // Build full image URLs for each product
    const productsWithImageUrls = products.map(product => ({
      ...product,
      images: Array.isArray(product.images)
        ? product.images.map(img => ({
            ...img,
            url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url}`
          }))
        : []
    }));

    const totalCount = await Product.getProductCount ? await Product.getProductCount(filters) : 0;

    return res.status(200).json({
      success: true,
      products: productsWithImageUrls,
      totalCount: totalCount
    });
  } catch (err) {
    console.error('Error fetching home products:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const products = await Product.findFeatured ? 
      await Product.findFeatured(limit) :
      await Product.findAll(limit, 0); // Fallback to all products
    
    return res.status(200).json({
      success: true,
      products: products
    });
  } catch (err) {
    console.error('Error fetching featured products:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get products by user with filters
exports.getUserProducts = async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  const { status, condition } = req.query;

  try {
    const filters = { user_id: parseInt(userId) };
    if (status) filters.status = status;
    if (condition) filters.condition = condition;

    const products = await Product.findByUserWithFilters ? 
      await Product.findByUserWithFilters(userId, limit, offset, filters) :
      await Product.findByUserlistings(userId);
    
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

// Advanced search with multiple filters
exports.advancedSearch = async (req, res) => {
  const {
    q, categoryId, condition, minPrice, maxPrice, location,
    swapPreference, negotiable, sortBy = 'created_at', sortOrder = 'desc',
    limit = 20, offset = 0
  } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  try {
    const filters = {
      search: q.trim(),
      status: 'active'
    };

    // Apply advanced filters
    if (categoryId) filters.category_id = parseInt(categoryId);
    if (condition) filters.condition = condition;
    if (location) filters.location = location;
    if (swapPreference) filters.swap_preference = swapPreference;
    if (negotiable !== undefined) filters.negotiable = negotiable === 'true';
    
    if (minPrice || maxPrice) {
      filters.priceRange = {};
      if (minPrice) filters.priceRange.min = parseFloat(minPrice);
      if (maxPrice) filters.priceRange.max = parseFloat(maxPrice);
    }

    const products = await Product.advancedSearch ? 
      await Product.advancedSearch(filters, parseInt(limit), parseInt(offset), sortBy, sortOrder) :
      await Product.search(q, parseInt(limit), parseInt(offset));
    
    return res.status(200).json({
      success: true,
      products: products,
      searchQuery: q,
      filters: filters
    });
  } catch (err) {
    console.error('Error in advanced search:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get similar products (based on category and wanted items)
exports.getSimilarProducts = async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const similarProducts = await Product.findSimilar ? 
      await Product.findSimilar(id, product.category_id, limit) :
      await Product.findByCategory(product.category_id, limit, 0);
    
    // Filter out the current product
    const filteredProducts = similarProducts.filter(p => p.id !== parseInt(id));
    
    return res.status(200).json({
      success: true,
      products: filteredProducts
    });
  } catch (err) {
    console.error('Error fetching similar products:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Toggle product status (active/inactive)
exports.toggleProductStatus = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this product'
      });
    }

    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    const updatedProduct = await Product.updateStatus ?
      await Product.updateStatus(productId, newStatus) :
      await Product.update(productId, { status: newStatus });

    return res.status(200).json({
      success: true,
      message: `Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      product: updatedProduct
    });
  } catch (err) {
    console.error('Error toggling product status:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get product statistics for dashboard
exports.getProductStats = async (req, res) => {
  const { userId } = req.params;
  const requestingUserId = req.user.id;

  // Check if user is requesting their own stats or is admin
  if (parseInt(userId) !== requestingUserId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to view these statistics'
    });
  }

  try {
    const stats = await Product.getUserStats ? 
      await Product.getUserStats(userId) :
      {
        total: 0,
        active: 0,
        inactive: 0,
        views: 0,
        offers_received: 0
      };
    
    return res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (err) {
    console.error('Error fetching product stats:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}