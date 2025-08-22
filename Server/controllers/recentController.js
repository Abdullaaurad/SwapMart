const {Recent} = require('../models');

exports.getRecent = async (req, res) => {
    const userid = req.user.id;
    try {
        const Recents = await Recent.getUserRecentViews(userid, 50);
        return res.status(200).json({
            success: true,
            recents: Recents || []
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