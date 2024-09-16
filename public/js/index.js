// Declarar socket al inicio, fuera de cualquier función.
const socket = io();

// Listener para actualizaciones del carrito
socket.on('cartUpdated', (cart) => {
    updateCartView(cart);
});

// Listener para errores
socket.on('cartError', (error) => {
    alert(`Error: ${error.message}`);
});

// Función para agregar un producto al carrito
function addToCart(productId, quantity) {
    const cartId = localStorage.getItem('cartId');
    const parsedQuantity = parseInt(quantity, 10) || 1;

    const url = cartId
        ? `/api/carts/${cartId}/product/${productId}`
        : `/api/carts/create/product/${productId}`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: parsedQuantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.cart) {
            if (!cartId) {
                localStorage.setItem('cartId', data.cart._id); // Guardar cartId en localStorage
            }
            alert('Producto agregado al carrito.');
            socket.emit('cartUpdated', data.cart);  // Emitir evento para actualizar el carrito
        }
    })
    .catch(error => {
        alert('Error al agregar el producto al carrito');
        console.error(error);
    });
}
function updateProductQuantity(productId) {
    const cartId = localStorage.getItem('cartId');
    const quantity = document.getElementById(`quantity-${productId}`).value;

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: parseInt(quantity, 10) })
    })
    .then(response => response.json())
    .then(data => {
        alert('Cantidad actualizada');
        socket.emit('cartUpdated', data.cart);  // Emitir evento para actualizar el carrito
    })
    .catch(error => {
        alert('Error al actualizar la cantidad');
        console.error(error);
    });
}

// Función para eliminar un producto del carrito
function deleteProductFromCart(productId) {
    const cartId = localStorage.getItem('cartId');

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Producto eliminado');
        socket.emit('cartUpdated', data.cart);  // Emitir evento para actualizar el carrito
    })
    .catch(error => {
        alert('Error al eliminar el producto');
        console.error(error);
    });
}
// Función para vaciar el carrito
function emptyCart() {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
        alert('No hay carrito disponible para vaciar.');
        return;
    }

    fetch(`/api/carts/${cartId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => {
        alert('Carrito vaciado correctamente.');
        socket.emit('cartUpdated', data.cart); // Emitir evento para actualizar el carrito
    })
    .catch(error => {
        alert('Error al vaciar el carrito');
        console.error(error);
    });
}

// Función para actualizar la vista del carrito
function updateCartView(cart) {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) {
        return;
    }

    cartContent.innerHTML = '';

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
            <button onclick="deleteProductFromCart('${product.product._id}')">Eliminar</button>
        `;
        ul.appendChild(li);
    });

    cartContent.appendChild(ul);
    cartContent.innerHTML += '<button onclick="emptyCart()">Vaciar carrito</button>';
    
}

// Al cargar la página, obtenemos el carrito si existe
document.addEventListener('DOMContentLoaded', () => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
        socket.emit('getCart', cartId);  // Pedimos el carrito al servidor
    }
});
