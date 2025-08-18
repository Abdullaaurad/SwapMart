const { Offer } = require('../models');
const { User } = require('../models');
const {Product} = require('../models');

exports.getOffer = async (req, res) => {
    const userid = req.user.id;
    try{
        const Offers = await Offer.findByBuyer(userid);

        for (let row of Offers){
            const offerer = await User.findById(row.buyer_id);
            const product = await Product.findById(row.product_id);

            row.offerer_name = offerer.fullname;
            row.product_title = product.title;
            row.product_images = product.images;
            row.description = product.description
        }

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

exports.createOffer = async (req, res) => {
  try {
    const buyer_id = req.user.id;
    const { product_id, offered_item_title, offered_item_description, offered_item_images, message } = req.body;

    // Find product and seller
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const seller_id = product.user_id;

    // Create offer
    const offerData = {
      product_id,
      buyer_id,
      seller_id,
      offered_item_title,
      offered_item_description,
      offered_item_images: offered_item_images || [],
      message,
      status: 'pending'
    };
    const newOffer = await Offer.create(offerData);

    return res.status(201).json({
      success: true,
      offer: newOffer
    });
  } catch (err) {
    console.error('Error creating offer:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.changeStatus = async (req,res) => {
  try{
    const offerId = req.params.id
    const {status} = req.body
    const userId = req.user.id

        if (!offerId) {
      return res.status(400).json({
        success: false,
        message: 'Offer ID is required'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status values
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Find the offer first to check if it exists and user has permission
    const offer = await Offer.findById(offerId);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Check if the user is the owner of the product (only product owner can accept/reject offers)
    const product = await Product.findById(offer.product_id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Associated product not found'
      });
    }

    if (product.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this offer'
      });
    }

    // Check if offer is already in a final state
    if (offer.status === 'accepted' || offer.status === 'rejected' || offer.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot update offer that is already ${offer.status}`
      });
    }

    // Update the offer status
    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      { 
        status: status,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update offer status'
      });
    }

    // Optional: If offer is accepted, you might want to update the product status or reject other offers
    if (status === 'accepted') {
      // Update product status to 'pending' or 'in_negotiation'
      await Product.findByIdAndUpdate(offer.product_id, {
        status: 'pending',
        updated_at: new Date()
      });

      // Optional: Auto-reject other pending offers for this product
      await Offer.updateMany(
        { 
          product_id: offer.product_id,
          _id: { $ne: offerId },
          status: 'pending'
        },
        { 
          status: 'rejected',
          updated_at: new Date()
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: `Offer ${status} successfully`,
      offer: updatedOffer
    });

  }catch (err) {
    console.error('Error creating offer:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}