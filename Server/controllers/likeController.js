const { Like } = require('../models');
const { User } = require('../models');
const { Product } = require('../models');
const { Notification } = require('../models');

exports.getLikes = async (req, res) => {
    const userId = req.user.id;
    try {
        const likes = await Like.getUserLikedProducts(userId);
        
        // Process each liked product's images
        const likesWithImageUrls = likes.map(like => {
            let processedImages = [];
            
            // Handle images array
            if (Array.isArray(like.images)) {
                processedImages = like.images.map(img => {
                    // If img is an object with url property
                    if (typeof img === 'object' && img.url) {
                        return {
                            ...img,
                            url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img.url}`
                        };
                    }
                    // If img is just a string filename
                    else if (typeof img === 'string') {
                        return {
                            url: `${req.protocol}://${req.get('host')}/Uploads/Product/${img}`
                        };
                    }
                    return img;
                });
            } else if (typeof like.images === 'string') {
                // Handle case where images is a JSON string
                try {
                    const parsedImages = JSON.parse(like.images);
                    processedImages = Array.isArray(parsedImages) 
                        ? parsedImages.map(img => ({
                            url: `${req.protocol}://${req.get('host')}/Uploads/Product/${typeof img === 'object' ? img.url || img : img}`
                        }))
                        : [];
                } catch (parseError) {
                    console.error('Error parsing images JSON:', parseError);
                    processedImages = [];
                }
            }

            return {
                ...like,
                images: processedImages
            };
        });

        return res.status(200).json({
            success: true,
            likes: likesWithImageUrls || []
        });
    } catch (err) {
        console.error('Error fetching likes:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.addLikes = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    
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
        // Add like to liked_products table
        const like = await Like.addLike(userId, parseInt(productId));
        
        if (!like) {
            return res.status(409).json({
                success: false,
                message: 'Product already liked'
            });
        }

        const product = await Product.findById(productId);
        if (product && product.user_id !== userId) {
            const liker = await User.findById(userId);
            await Notification.create({
                user_id: product.user_id,
                title: 'Product Liked',
                message: `${liker.fullname} liked your product "${product.title}"`,
                details: `User ${liker.fullname} liked your listing: ${product.title}.`,
                type: 'info',
                icon: 'heart-outline'
            });
        }
        
        return res.status(201).json({
            success: true,
            data: {
                id: like.id,
                user_id: like.user_id,
                product_id: like.product_id,
                liked_at: like.liked_at
            },
            message: 'Product liked successfully'
        });
    } catch (err) {
        console.error('Error adding like:', err);
        
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

exports.removeLikes = async (req, res) => {
    const likeId = req.params.id;

    // Validate likeId
    if (!likeId) {
        return res.status(400).json({
            success: false,
            message: 'Like ID is required'
        });
    }

    // Validate likeId is a number
    if (isNaN(parseInt(likeId))) {
        return res.status(400).json({
            success: false,
            message: 'Like ID must be a valid number'
        });
    }

    try {
        // Remove like from liked_products table
        const result = await Like.removeLike(likeId);
        
        // if (!result) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Like not found or does not belong to user'
        //     });
        // }
        
        return res.status(200).json({
            success: true,
            message: 'Like removed successfully'
        });
    } catch (err) {
        console.error('Error removing like:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.checkLike = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

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
        const likeRecord = await Like.isLiked(userId, parseInt(productId));
        
        if (likeRecord) {
            return res.status(200).json({
                success: true,
                liked: true,
                likeId: likeRecord.id  // Access the first record's id
            });
        } else {
            return res.status(200).json({
                success: false,  // Changed from false to true
                liked: false,
                likeId: null
            });
        }
    } catch (err) {
        console.error('Error checking like:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}