
import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { productsManager } from '../dao/productsManager.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const result = await productsManager.getAllProducts({
            query: {
                category: query?.category,
                availability: query?.availability
            },
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
        });

        res.status(200).render('index', {
            products: result.products,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: "El ID del producto no es válido" });
        }

        const product = await productsManager.getProductById(pid);
        if (product) {
            res.status(200).render('productDetails', { product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

export default router;
