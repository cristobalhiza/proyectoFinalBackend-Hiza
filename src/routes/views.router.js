import { Router } from 'express';
import ProductsManager from '../dao/productsManager.js'; 
import { procesaErrores } from '../utils.js';

export const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('home', { products: result.docs });
    } catch (error) {
        return procesaErrores(error, res)
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await ProductsManager.get(page, limit);

        res.render('realTimeProducts', { products: result.docs });
    } catch (error) {
        return procesaErrores(error, res)
    }
});

export default router;