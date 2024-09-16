const socket = io();

socket.on('cartUpdated', (cart) => {
    updateCartView(cart);
});

socket.on('cartError', (error) => {
    alert(`Error: ${error.message}`);
});

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
                    localStorage.setItem('cartId', data.cart._id);
                    socket.emit('cartCreated', data.cart._id);
                    setTimeout(() => {
                        location.reload();
                    }, 2500);
                }
                alert('Producto agregado al carrito.');
                socket.emit('cartUpdated', data.cart);
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
            socket.emit('cartUpdated', data.cart);
        })
        .catch(error => {
            alert('Error al actualizar la cantidad');
            console.error(error);
        });
}

function deleteProductFromCart(productId) {
    const cartId = localStorage.getItem('cartId');

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            alert('Producto eliminado');
            socket.emit('cartUpdated', data.cart);
        })
        .catch(error => {
            alert('Error al eliminar el producto');
            console.error(error);
        });
}

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
            socket.emit('cartUpdated', data.cart);
        })
        .catch(error => {
            alert('Error al vaciar el carrito');
            console.error(error);
        });
}

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

document.addEventListener('DOMContentLoaded', () => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
        socket.emit('getCart', cartId);
    }
});

socket.on('cartCreated', (cartId) => {

    localStorage.setItem('cartId', cartId);
    alert('Nuevo carrito creado.');
});