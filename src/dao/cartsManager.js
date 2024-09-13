
import Cart from './models/cartsModel.js';

export class CartsManager {
    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            await cart.save();
            return cart.populate('products.product').lean();  // Use lean()
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart.populate('products.product').lean();  // Use lean()
        } catch (error) {
            throw new Error('Error deleting product from cart: ' + error.message);
        }
    }

    async getCart(cartId) {
        try {
            return await Cart.findById(cartId).populate('products.product').lean();  // Use lean()
        } catch (error) {
            throw new Error('Error fetching cart: ' + error.message);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            cart.products = [];
            await cart.save();
            return cart.populate('products.product').lean();  // Use lean()
        } catch (error) {
            throw new Error('Error clearing cart: ' + error.message);
        }
    }
}

export const cartsManager = new CartsManager();
