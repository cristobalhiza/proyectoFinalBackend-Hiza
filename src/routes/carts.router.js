import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { CartsManager } from '../dao/cartsManager.js';
import Product from '../dao/models/productsModel.js';
import Cart from '../dao/models/cartsModel.js';
import { procesaErrores } from '../utils.js';

const router = Router();
const cartsManager = new CartsManager();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).render('cart', { error: 'El ID del carrito no es válido.' });
        }

        const cart = await cartsManager.getCart(cid);

        if (!cart) {
            return res.status(404).render('cart', { error: 'Carrito no encontrado' });
        }

        res.render('cart', { cart });
    } catch (error) {
        res.status(500).render('cart', { error: 'Hubo un error al obtener el carrito.' });
    }
});

router.post('/create/product/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del producto no es válido' });
        }

        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const cart = await Cart.create({ products: [{ product: pid, quantity: parsedQuantity }] });

        res.status(201).json({ cart });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo crear el carrito', detalle: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del carrito o del producto no es válido' });
        }

        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const cart = await cartsManager.addProductToCart(cid, pid, parsedQuantity);

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo agregar el producto al carrito', detalle: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ error: 'El ID del carrito o del producto no es válido' });
        }

        const cart = await cartsManager.deleteProductFromCart(cid, pid);

        res.status(200).json({ cart });
    } catch (error) {
        return procesaErrores(error, res);
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: 'El ID del carrito no es válido' });
        }

        const cart = await cartsManager.clearCart(cid);

        res.status(200).json({ cart });
    } catch (error) {
        return procesaErrores(error, res)
    }
});

export default router;
