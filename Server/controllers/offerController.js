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