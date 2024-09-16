import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { procesaErrores } from '../utils.js';
import { CartsManager } from '../dao/cartsManager.js';

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).render('cart', { error: 'El ID del carrito no es válido.' });
        }

        const cart = await CartsManager.getCart(cid);

        if (!cart) {
            return res.status(404).render('cart', { error: 'Carrito no encontrado' });
        }

        res.render('cart', { cart });
    } catch (error) {
        return procesaErrores(res, error);
    }
});

export default router;