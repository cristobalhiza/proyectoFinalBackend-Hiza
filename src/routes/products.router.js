import { Router } from 'express';

const productsRouter = (productsManager) => {
    const router = Router();

    router.get('/', async (req, res) => {
        try {
            const products = await productsManager.getProducts();
            let { limit, skip } = req.query;

            if (limit) {
                limit = Number(limit);
                if (isNaN(limit) || limit < 0) {
                    return res.status(400).json({ error: "Limit debe ser un número entero mayor o igual a 0" });
                }
            } else {
                limit = products.length;
            }

            if (skip) {
                skip = Number(skip);
                if (isNaN(skip) || skip < 0) {
                    return res.status(400).json({ error: "Skip debe ser un número entero mayor o igual a 0" });
                }
            } else {
                skip = 0;
            }

            let resultado = products.slice(skip, skip + limit);
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ resultado });
        } catch (error) {
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({
                error: "Error inesperado en el servidor - Intente más tarde",
                detalle: `${error.message}`,
            });
        }
    });

    router.get('/:pid', async (req, res) => {
        let { pid } = req.params;
        pid = Number(pid);
        if (isNaN(pid)) {
            return res.status(400).json({ error: "El ID del producto debe ser un número" });
        }

        try {
            const product = await productsManager.getProductById(pid);
            if (!product) {
                return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
            }
            res.setHeader("Content-Type", "application/json");
            res.status(200).json({ product });
        } catch (error) {
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({
                error: "Error inesperado en el servidor - Intente más tarde",
                detalle: `${error.message}`,
            });
        }
    });

    return router;
};

export default productsRouter;
