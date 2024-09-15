import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import ProductsManager from '../dao/productsManager.js';  
import { procesaErrores } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const result = await ProductsManager.get(page, limit);

        res.status(200).render('index', {
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
        return procesaErrores(res, error)
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: "El ID del producto no es válido" });
        }

        const product = await ProductsManager.getBy({ _id: pid });
        if (product) {
            res.status(200).render('productDetails', { product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        return procesaErrores(res, error)
    }
});

export default router;