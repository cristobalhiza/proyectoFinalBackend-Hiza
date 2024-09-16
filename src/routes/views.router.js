import { Router } from 'express';
import ProductsManager from '../dao/productsManager.js';
import { procesaErrores } from '../utils.js';

export const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        return procesaErrores(error, res)
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await ProductsManager.get(page, limit);

        res.render('realTimeProducts', {
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: parseInt(limit),
        });
    } catch (error) {
        return procesaErrores(res, error);
    }
});

export default router;