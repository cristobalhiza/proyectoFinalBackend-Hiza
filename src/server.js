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
import productsManager from './dao/productsManager.js';
import { CartsManager } from './dao/cartsManager.js';
import Cart from './dao/models/cartsModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = config.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

connectDB();

app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/api/products', apiProductsRouter)
app.use('/carts', cartsRouter);
app.use('/api/carts', apiCartsRouter)

handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

server.listen(PORT, () => {
    console.log(`Servidor online en puerto ${PORT}`);
});

const cartsManager = new CartsManager();

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('newProduct', async (product) => {
        try {
            const { title, price, category, stock } = product;

            if (!title || price <= 0 || !category || stock < 0) {
                throw new Error("Datos de producto inválidos.");
            }

            const updatedProducts = await productsManager.addProduct({ title, price, category, stock });
            io.emit('productListUpdated', updatedProducts);
        } catch (error) {
            socket.emit('productError', error.message);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            const updatedProducts = await productsManager.deleteProduct(productId);
            io.emit('productListUpdated', updatedProducts);
        } catch (error) {
            socket.emit('productError', error.message);
        }
    });

    socket.on('addToCart', async ({ cartId, productId, quantity }) => {
        try {

            if (!cartId) {
                const newCart = await Cart.create({ products: [{ product: productId, quantity }] });
                cartId = newCart._id;
                socket.emit('cartCreated', { cartId });
            } else {

                const updatedCart = await cartsManager.addProductToCart(cartId, productId, quantity);
                socket.emit('cartUpdated', updatedCart);
            }
        } catch (error) {
            socket.emit('cartError', { message: 'Error agregando producto al carrito' });
        }
    });

    socket.on('updateCartProduct', async ({ cartId, productId, quantity }) => {
        try {
            if (!cartId) throw new Error(`Carrito no encontrado para el ID: ${cartId}`);

            const updatedCart = await cartsManager.updateProductQuantity(cartId, productId, quantity);
            socket.emit('cartUpdated', updatedCart);
            socket.emit('productUpdated', 'El producto ha sido actualizado correctamente.');
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    socket.on('deleteCartProduct', async ({ cartId, productId }) => {
        try {
            if (!cartId) throw new Error('Carrito no encontrado');

            const updatedCart = await cartsManager.deleteProductFromCart(cartId, productId);
            socket.emit('cartUpdated', updatedCart);
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    socket.on('emptyCart', async ({ cartId }) => {
        try {
            if (!cartId) throw new Error('Carrito no encontrado');

            const updatedCart = await cartsManager.clearCart(cartId);
            if (updatedCart.products.length === 0) {
                console.log(`Carrito ${cartId} vaciado con éxito.`);
            }
            socket.emit('cartUpdated', updatedCart);
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    socket.on('getCart', async (cartId) => {
        try {
            const cart = await cartsManager.getCart(cartId);
            if (cart.products.length === 0) {
                console.log(`Carrito ${cartId} está vacío.`);
            }
            socket.emit('cartUpdated', cart);
        } catch (error) {
            socket.emit('cartError', { message: 'Error obteniendo el carrito' });
        }
    });
});
