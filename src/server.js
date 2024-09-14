import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { productsManager } from './dao/productsManager.js';
import { CartsManager } from './dao/cartsManager.js';
import Cart from './dao/models/cartsModel.js';
import connectDB from './connDB.js';
import handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
});
// me apareció unos errores con handlebars y según revisé en internet, estas ultimas lineas era la forma de arreglarlo

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
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
