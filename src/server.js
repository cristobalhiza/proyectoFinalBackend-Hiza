import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './connDB.js';
import { config } from './config/config.js';
import { engine } from 'express-handlebars';
import handlebars from 'handlebars';
import productsRouter from './routes/products.router.js';
import apiProductsRouter from './routes/apiProducts.router.js'
import cartsRouter from './routes/carts.router.js';
import apiCartsRouter from './routes/apiCarts.router.js'
import viewsRouter from './routes/views.router.js'
import { CartsManager } from './dao/cartsManager.js';
import ProductsManager from './dao/productsManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = config.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

connectDB();

app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/api/products', apiProductsRouter)
app.use('/carts', cartsRouter);
app.use('/api/carts', apiCartsRouter)

server.listen(PORT, () => {
    console.log(`Servidor online en puerto ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('cartUpdated', (cart) => {
        console.log('Carrito actualizado:', cart);
        io.emit('cartUpdated', cart);
    });

    socket.on('addToCart', async ({ cartId, productId, quantity }) => {
        try {
            let cart;
            if (!cartId) {
                cart = await CartsManager.create();
                cartId = cart._id;
                cart = await CartsManager.addProductToCart(cartId, productId, quantity);
                socket.emit('cartCreated', cartId);
            } else {
                cart = await CartsManager.addProductToCart(cartId, productId, quantity);
            }
            socket.emit('cartUpdated', cart);
        } catch (error) {
            console.error('Error agregando producto al carrito:', error);
            socket.emit('cartError', { message: 'Error agregando producto al carrito' });
        }
    });

    socket.on('updateCartProduct', async ({ cartId, productId, quantity }) => {
        try {
            const updatedCart = await CartsManager.updateProductQuantity(cartId, productId, quantity);
            io.emit('cartUpdated', updatedCart);
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    socket.on('deleteCartProduct', async ({ cartId, productId }) => {
        try {
            const updatedCart = await CartsManager.deleteProductFromCart(cartId, productId);
            io.emit('cartUpdated', updatedCart);
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    socket.on('emptyCart', async ({ cartId }) => {
        try {
            const updatedCart = await CartsManager.clearCart(cartId);
            io.emit('cartUpdated', updatedCart);
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    socket.on('getCart', async (cartId) => {
        try {
            const cart = await CartsManager.getCart(cartId);
            socket.emit('cartUpdated', cart);
        } catch (error) {
            socket.emit('cartError', { message: 'Error obteniendo el carrito' });
        }
    });

    socket.on('newProduct', async (productData) => {

        try {
            const { title, price, category, stock, code, description } = productData;
    
            if (!code || !title || !price || !category || stock == null) {
                socket.emit('productError', { message: 'Faltan campos obligatorios' });
                return;
            }
    
            const newProduct = await ProductsManager.create({ 
                title, 
                price, 
                category, 
                stock, 
                code, 
                description,
                status: true,  
                thumbnail: ''
            });
    
            console.log('New product saved:', newProduct);
    
            const updatedProducts = await ProductsManager.get();
    
            io.emit('productListUpdated', updatedProducts.docs);
        } catch (error) {
            console.error('Error creating product:', error);
            socket.emit('productError', { message: 'Error al agregar el producto' });
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await ProductsManager.delete(productId);

            const updatedProducts = await ProductsManager.get();

            io.emit('productListUpdated', updatedProducts.docs);
        } catch (error) {
            socket.emit('productError', { message: 'Error al eliminar el producto' });
        }
    });
});
