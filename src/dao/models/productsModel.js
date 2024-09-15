
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
    {
        code: {
            type: String, 
            unique: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        }
    }, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
