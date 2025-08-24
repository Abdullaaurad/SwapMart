const {Recent} = require('../models');
const { Product } = require('../models');
const { User } = require('../models');
const { Notification } = require('../models');

exports.getRecent = async (req, res) => {
    const userid = req.user.id;
    try {
        const recents = await Recent.getUserRecentViews(userid, 50);
        
        // Process each recent item to add full image URLs
        const processedRecents = recents.map(recent => {
            // Check if recent has a product property or if recent itself is the product
            const product = recent.product || recent;
            
            return {
                ...recent,
                // If recent has a separate product object, process it
                ...(recent.product && {
                    product: {
                        ...product,
                        images: Array.isArray(product.images)
                            ? product.images.map(img => {
                                if (typeof img === 'string') {
                                    return `${req.protocol}://${req.get('host')}/Uploads/Product/${img}`;
                                }
                                return {
                                    ...img,
                                    url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url || img}`
                                };
                            })
                            : []
                    }
                }),
                // If recent itself contains product data directly, process images
                ...(!recent.product && {
                    images: Array.isArray(product.images)
                        ? product.images.map(img => {
                            if (typeof img === 'string') {
                                return `${req.protocol}://${req.get('host')}/Uploads/Product/${img}`;
                            }
                            return {
                                ...img,
                                url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url || img}`
                            };
                        })
                        : []
                })
            };
        });

        return res.status(200).json({
            success: true,
            recents: processedRecents || []
        });
    } catch (err) {
        console.error('Error fetching recents:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.clearAllRecents = async (req, res) => {
    const userId = req.user.id;
    try {
        await Recent.clearAllViews(userId);
        return res.status(200).json({
            success: true,
            message: 'All recent views cleared'
        });
    } catch (err) {
        console.error('Error clearing recents:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.addRecentView = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
    
    // Validate productId
    if (!productId) {
        return res.status(400).json({
            success: false,
            message: 'Product ID is required'
        });
    }

    // Validate productId is a number
    if (isNaN(parseInt(productId))) {
        return res.status(400).json({
            success: false,
            message: 'Product ID must be a valid number'
        });
    }
    
    try {
        // Add view to recent_views table
        const view = await Recent.addView(userId, parseInt(productId));

        const product = await Product.findById(productId);
        if (product && product.user_id !== userId) { // Don't notify if user views own product
            const viewer = await User.findById(userId);
            const ownerId = product.user_id;

            // Create notification for owner
            await Notification.create({
                user_id: ownerId,
                title: 'Product Viewed',
                message: `${viewer.fullname} viewed your product "${product.title}"`,
                details: `User ${viewer.fullname} checked out your listing: ${product.title}.`,
                type: 'info',
                icon: 'eye-outline'
            });
        }
        
        return res.status(201).json({
            success: true,
            data: {
                id: view.id,
                user_id: view.user_id,
                product_id: view.product_id,
                viewed_at: view.viewed_at
            },
            message: 'Product view recorded successfully'
        });
    } catch (err) {
        console.error('Error recording product view:', err);
        
        // Handle specific database errors
        if (err.message.includes('foreign key')) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};