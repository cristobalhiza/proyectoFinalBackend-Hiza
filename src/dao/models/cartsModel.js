
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
});

// Automatically populate products when using findOne
cartSchema.pre('findOne', function () {
    this.populate('products.product').lean();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
