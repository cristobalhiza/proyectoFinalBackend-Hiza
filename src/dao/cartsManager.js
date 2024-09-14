import mongoose from 'mongoose';
import Cart from './models/cartsModel.js';

export class CartsManager {
    async addProductToCart(cartId, productId, quantity) {
        try {
            if (quantity <= 0) {
                throw new Error('La cantidad debe ser mayor que cero.');
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            const existingProduct = cart.products.find(p => p.product.equals(mongoose.Types.ObjectId.createFromHexString(productId)));

            if (existingProduct) {

                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: mongoose.Types.ObjectId.createFromHexString(productId), quantity });
            }

            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            throw new Error('Error agregando producto al carrito: ' + error.message);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            cart.products = cart.products.filter(p => !p.product.equals(mongoose.Types.ObjectId.createFromHexString(productId)));
            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            throw new Error('Error eliminando producto del carrito: ' + error.message);
        }
    }

    async getCart(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product').lean();
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            return cart;
        } catch (error) {
            throw new Error('Error obteniendo carrito: ' + error.message);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            cart.products = [];
            await cart.save();
            await cart.populate('products.product');
            return cart;
        } catch (error) {
            throw new Error('Error vaciando carrito: ' + error.message);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado.');

        const productInCart = cart.products.find(p => p.product.equals(mongoose.Types.ObjectId.createFromHexString(productId)));

        if (!productInCart) throw new Error('Producto no encontrado en el carrito.');

        productInCart.quantity = quantity;
        await cart.save();

        await cart.populate('products.product');

        return cart;
    }
}

export const cartsManager = new CartsManager();
