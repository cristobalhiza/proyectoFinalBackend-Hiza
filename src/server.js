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

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
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

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('newProduct', async (product) => {
        try {
            const updatedProducts = await productsManager.addProduct(product);
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
});
