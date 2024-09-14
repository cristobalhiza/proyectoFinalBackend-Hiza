const socket = io();

// Escuchar el evento 'cartUpdated' y 'cartError' una sola vez para todos los casos en el frontend
socket.on('cartUpdated', (cart) => {
    console.log('Carrito actualizado', cart);
    updateCartView(cart);
});

socket.on('cartError', (error) => {
    alert(`Error: ${error.message}`);
});

socket.on('cartCreated', ({ cartId }) => {
    localStorage.setItem('cartId', cartId);
    alert('Nuevo carrito creado.');
});

socket.on('productListUpdated', (products) => {
    updateProductList(products);
});

socket.on('productError', (errorMessage) => {
    alert("Error: " + errorMessage);
});

// Función para actualizar la lista de productos en la interfaz
function updateProductList(products) {
    const productList = document.getElementById('products-list') || document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - $${product.price}`;
        li.dataset.id = product.id;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deleteProduct(product.id);
        li.appendChild(deleteButton);

        productList.appendChild(li);
    });
}

// Función para agregar productos al carrito
function addToCart(productId, quantity) {
    let cartId = localStorage.getItem('cartId');
    socket.emit('addToCart', { cartId, productId, quantity });
}

// Función para actualizar la cantidad de productos en el carrito
function updateProductQuantity(productId) {
    const quantity = document.getElementById(`quantity-${productId}`).value;
    socket.emit('updateCartProduct', { productId, quantity });
}

// Función para eliminar un producto del carrito
function deleteProductFromCart(productId) {
    let cartId = localStorage.getItem('cartId');
    socket.emit('deleteCartProduct', { cartId, productId });
}

// Función para vaciar el carrito
function emptyCart() {
    const cartId = localStorage.getItem('cartId');
    
    if (!cartId) {
        alert('No hay carrito disponible para vaciar.');
        return;
    }
    
    socket.emit('emptyCart', { cartId });  // Emite evento 'emptyCart' al servidor
}

// Función para eliminar productos
function deleteProduct(productId) {
    console.log(`Eliminando producto con ID: ${productId}`);
    socket.emit('deleteProduct', productId); 
}

// Función para actualizar la vista del carrito en la interfaz
function updateCartView(cart) {
    const cartContentCart = document.getElementById('cart-content-cart');
    const cartContentProductDetails = document.getElementById('cart-content-product-details');

    // Verificar cuál está disponible
    const cartContent = cartContentCart || cartContentProductDetails;

    if (!cartContent) {
        console.warn("No se encontró el contenedor del carrito en esta página.");
        return;
    }

    cartContent.innerHTML = '';  // Limpiar el contenido previo

    if (cart.products.length === 0) {
        cartContent.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    const ul = document.createElement('ul');
    cart.products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${product.product.title}</strong> - $${product.product.price}
            <label for="quantity">Cantidad:</label>
            <input type="number" id="quantity-${product.product._id}" name="quantity" value="${product.quantity}" min="1">
            <button onclick="updateProductQuantity('${product.product._id}')">Actualizar</button>
            <button onclick="deleteProductFromCart('${product.product._id}')">Eliminar del carrito</button>
        `;
        ul.appendChild(li);
    });

    cartContent.appendChild(ul);

    // Botón para vaciar el carrito
    const emptyCartButton = `
        <button onclick="emptyCart()">Vaciar carrito</button>
    `;
    cartContent.innerHTML += emptyCartButton;
}

// Emitir 'getCart' cuando se carga la página del carrito
const cartId = localStorage.getItem('cartId');
if (cartId) {
    socket.emit('getCart', cartId);  // Solicitar el carrito desde el servidor
} else {
    document.getElementById('cart-content').innerHTML = '<p>El carrito está vacío.</p>';
}
