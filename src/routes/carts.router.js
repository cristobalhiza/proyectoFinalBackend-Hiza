import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { CartsManager } from '../dao/cartsManager.js';
import Product from '../dao/models/productsModel.js';
import Cart from '../dao/models/cartsModel.js';  // Ensure Cart model is imported

const router = Router();
const cartsManager = new CartsManager();

// Route to get a cart by its ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // Validate cart ID
        if (!isValidObjectId(cid)) {
            return res.status(400).render('cart', { error: 'El ID del carrito no es válido.' });
        }

        // Get cart from CartsManager
        const cart = await cartsManager.getCart(cid);

        if (!cart) {
            return res.status(404).render('cart', { error: 'Carrito no encontrado' });
        }

        // Render cart view with cart data
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).render('cart', { error: 'Hubo un error al obtener el carrito.' });
    }
});

// Create a new cart and add product to it
router.post('/create/product/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { quantity } = req.body;

        // Validate the product ID
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del producto no es válido' });
        }

        // Validate quantity
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        // Check if the product exists
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Create a new cart and add the product
        const cart = await Cart.create({ products: [{ product: pid, quantity: parsedQuantity }] });

        res.status(201).json({ cart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'No se pudo crear el carrito', detalle: error.message });
    }
});

// Add product to an existing cart
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Validate cart and product IDs
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del carrito o del producto no es válido' });
        }

        // Validate quantity
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        // Check if the product exists
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Add product to the existing cart
        const cart = await cartsManager.addProductToCart(cid, pid, parsedQuantity);

        res.status(200).json({ cart });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: 'No se pudo agregar el producto al carrito', detalle: error.message });
    }
});

export default router;