import fs from 'fs/promises';

export class CartsManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getCarts() {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error("No se pudieron obtener los carritos: " + error.message);
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === id);
            if (!cart) {
                throw new Error(`Carrito con ID ${id} no encontrado`);
            }
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito por ID: " + error.message);
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: this.generateId(carts),
                products: [],
            };
            carts.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            throw new Error("No se pudo crear el carrito: " + error.message);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(c => c.id === cartId);
            if (cartIndex !== -1) {
                const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);
                if (productIndex !== -1) {
                    carts[cartIndex].products[productIndex].quantity += 1;
                } else {
                    carts[cartIndex].products.push({ product: productId, quantity: 1 });
                }
                await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
                return carts[cartIndex];
            } else {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }
        } catch (error) {
            throw new Error("No se pudo agregar el producto al carrito: " + error.message);
        }
    }

    async deleteCart(id) {
        try {
            const carts = await this.getCarts();
            const newCarts = carts.filter(c => c.id !== id);
            if (carts.length !== newCarts.length) {
                await fs.writeFile(this.path, JSON.stringify(newCarts, null, 2));
                return true;
            } else {
                throw new Error(`Carrito con ID ${id} no encontrado`);
            }
        } catch (error) {
            throw new Error("No se pudo eliminar el carrito: " + error.message);
        }
    }

    generateId(carts) {
        const maxId = carts.reduce((max, c) => (c.id > max ? c.id : max), 0);
        return maxId + 1;
    }
}