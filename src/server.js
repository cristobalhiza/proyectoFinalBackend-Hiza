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

        // Escuchar cuando el carrito ha sido actualizado
        socket.on('cartUpdated', (cart) => {
            console.log('Carrito actualizado:', cart);
            // Emitir el carrito actualizado a todos los clientes
            io.emit('cartUpdated', cart);
        });

    socket.on('addToCart', async ({ cartId, productId, quantity }) => {
        try {
            let cart;
            if (!cartId) {
                // Si no hay carrito, creamos uno nuevo
                cart = await Cart.create({ products: [{ product: productId, quantity }] });
                cartId = cart._id; // Obtenemos el ID del nuevo carrito
                socket.emit('cartCreated', cartId); // Emitimos el nuevo cartId al cliente
            } else {
                cart = await cartsManager.addProductToCart(cartId, productId, quantity);
            }
            socket.emit('cartUpdated', cart); // Emitimos la actualización del carrito
        } catch (error) {
            console.error('Error agregando producto al carrito:', error);
            socket.emit('cartError', { message: 'Error agregando producto al carrito' });
        }
    });

    // Evento para actualizar la cantidad de un producto
    socket.on('updateCartProduct', async ({ cartId, productId, quantity }) => {
        try {
            const updatedCart = await CartsManager.updateProductQuantity(cartId, productId, quantity);
            io.emit('cartUpdated', updatedCart);  // Emitir el carrito actualizado a todos los clientes
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    // Evento para eliminar un producto del carrito
    socket.on('deleteCartProduct', async ({ cartId, productId }) => {
        try {
            const updatedCart = await CartsManager.deleteProductFromCart(cartId, productId);
            io.emit('cartUpdated', updatedCart);  // Emitir el carrito actualizado a todos los clientes
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    // Evento para vaciar el carrito
    socket.on('emptyCart', async ({ cartId }) => {
        try {
            const updatedCart = await CartsManager.clearCart(cartId);
            io.emit('cartUpdated', updatedCart);  // Emitir el carrito actualizado a todos los clientes
        } catch (error) {
            socket.emit('cartError', { message: error.message });
        }
    });

    // Obtener el carrito al conectar
    socket.on('getCart', async (cartId) => {
        try {
            const cart = await CartsManager.getCart(cartId);
            socket.emit('cartUpdated', cart);  // Enviar el carrito actualizado solo al cliente que lo solicitó
        } catch (error) {
            socket.emit('cartError', { message: 'Error obteniendo el carrito' });
        }
    });
});
