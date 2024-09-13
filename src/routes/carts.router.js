
import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { CartsManager } from '../dao/cartsManager.js';

const router = Router();
const cartsManager = new CartsManager();

// Get a cart by its ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        if (!isValidObjectId(cid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "El ID del carrito no es válido" });
        }

        const cart = await cartsManager.getCart(cid);
        if (cart) {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ cart });
        } else {
            res.setHeader("Content-Type", "application/json");
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ error: 'Error inesperado en el servidor al intentar obtener el carrito' });
    }
});

// Create a new cart
router.post('/', async (req, res) => {
    let { userId, ...otros } = req.body;
    if (!userId) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "El ID del usuario es requerido para crear un carrito" });
    }

    try {
        const newCart = await cartsManager.createCart({ userId });
        res.setHeader("Content-Type", "application/json");
        return res.status(201).json({ cart: newCart });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Error inesperado en el servidor - Intente nuevamente" });
    }
});

// Add a product to a cart
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "El ID del carrito o del producto no es válido" });
        }

        const cart = await cartsManager.addProductToCart(cid, pid, req.body.quantity || 1);
        if (cart) {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ cart });
        } else {
            res.setHeader("Content-Type", "application/json");
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
    }
});

// Delete a cart by its ID
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: "El ID del carrito no es válido" });
        }

        const result = await cartsManager.clearCart(cid);
        if (result) {
            res.status(200).json({ message: 'Carrito eliminado' });
        } else {
            res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
        }
    } catch (error) {
        console.error("Error al eliminar el carrito:", error);
        res.status(500).json({
            error: "Error inesperado en el servidor - Intente nuevamente",
            detalle: `${error.message}`,
        });
    }
});

export default router;
