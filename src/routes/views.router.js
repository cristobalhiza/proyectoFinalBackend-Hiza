import express from 'express';
import { productsManager } from '../dao/productsManager.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await productsManager.getAllProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productsManager.getAllProducts();
    res.render('realTimeProducts', { products });
});

export default router;
