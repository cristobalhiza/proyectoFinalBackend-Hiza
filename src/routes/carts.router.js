import { Router } from 'express';
import { CartsManager } from '../dao/cartsManager.js';

const router = Router();
const cartsManager = new CartsManager('./src/data/carts.json');

router.get('/:cid', async (req, res) => {
    try {
        let { cid } = req.params;
        cid = Number(cid);
        if (isNaN(cid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "El ID del carrito debe ser un número" });
        }

        const cart = await cartsManager.getCartById(cid);
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
        res.status(500).json({ error: 'Error inesperado en el servidor al intentar obtener el carrito - intente más tarde' });
    }
});

router.post('/', async (req, res) => {
    let { userId, ...otros } = req.body;
    if (!userId) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "El ID del usuario es requerido para crear un carrito" });
    }

    try {
        const carts = await cartsManager.getCarts();
        let existe = carts.find(c => c.userId === userId);
        if (existe) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Ya existe un carrito para el usuario con ID ${userId}` });
        }

        let newCart = await cartsManager.createCart();
        res.setHeader("Content-Type", "application/json");
        return res.status(201).json({ cart: newCart });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Error inesperado en el servidor - Intente nuevamente" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        let { cid, pid } = req.params;
        cid = Number(cid);
        pid = Number(pid);

        if (isNaN(cid) || isNaN(pid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: "El ID del carrito y el ID del producto deben ser números" });
        }

        const cart = await cartsManager.addProductToCart(cid, pid);
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

router.delete('/:cid', async (req, res) => {
    let { cid } = req.params;
    cid = Number(cid);
    if (isNaN(cid)) {
        return res.status(400).json({ error: "El ID del carrito debe ser un número" });
    }

    try {
        const result = await cartsManager.deleteCart(cid);
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