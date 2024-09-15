import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
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
    }
}, { timestamps: true });

cartSchema.pre('findOne', function () {
    this.populate('products.product');
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
