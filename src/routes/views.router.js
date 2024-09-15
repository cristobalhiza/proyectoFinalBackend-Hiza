import { Router } from 'express';
import ProductsManager from '../dao/productsManager.js'; 
import { procesaErrores } from '../utils.js';

export const router = Router();

// Ruta para renderizar la vista 'home' con productos
router.get('/', async (req, res) => {
    try {
        // Obtener todos los productos (usamos paginación, pero puedes ajustarla como prefieras)
        const { page = 1, limit = 20 } = req.query;
        const result = await ProductsManager.get(page, limit);

        res.render('home', { products: result.docs });  // Renderiza la vista 'home' con los productos
    } catch (error) {
        return procesaErrores(error, res)
    }
});

// Ruta para renderizar la vista 'realTimeProducts' con productos
router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtener todos los productos para la vista 'realTimeProducts'
        const { page = 1, limit = 20 } = req.query;
        const result = await ProductsManager.get(page, limit);

        res.render('realTimeProducts', { products: result.docs });  // Renderiza la vista 'realTimeProducts' con los productos
    } catch (error) {
        return procesaErrores(error, res)
    }
});

export default router;