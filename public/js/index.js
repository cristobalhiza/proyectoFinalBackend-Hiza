const socket = io();

socket.on('cartUpdated', (cart) => {
    console.log('Carrito actualizado', cart);
    updateCartView(cart);
});

socket.on('cartError', (error) => {
    alert(`Error: ${error.message}`);
});

socket.on('productUpdated', (message) => {
    alert(message);
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

function addToCart(productId, quantity) {
    let cartId = localStorage.getItem('cartId');

    const parsedQuantity = parseInt(quantity, 10);

    socket.emit('addToCart', { cartId, productId, quantity: parsedQuantity });
}

function updateProductQuantity(productId) {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
        document.getElementById('verCarrito').href = `/api/carts/${cartId}`;
    } else {
        alert("No se ha encontrado un carrito.");
    }

    const quantity = document.getElementById(`quantity-${productId}`).value;

    socket.emit('updateCartProduct', { cartId, productId, quantity });
}

function deleteProductFromCart(productId) {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
        alert('No se ha encontrado un carrito válido.');
        return;
    }

    socket.emit('deleteCartProduct', { cartId, productId });
}

function emptyCart() {
    const cartId = localStorage.getItem('cartId');

    if (!cartId) {
        alert('No hay carrito disponible para vaciar.');
        return;
    }

    socket.emit('emptyCart', { cartId });
}

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}

function updateCartView(cart) {
    const cartContentCart = document.getElementById('cart-content-cart');
    const cartContentProductDetails = document.getElementById('cart-content-product-details');

    const cartContent = cartContentCart || cartContentProductDetails;

    if (!cartContent) {
        console.warn("No se encontró el contenedor del carrito en esta página.");
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
            <button onclick="deleteProductFromCart('${product.product._id}')">Eliminar del carrito</button>
        `;
        ul.appendChild(li);
    });

    cartContent.appendChild(ul);

    const emptyCartButton = `
        <button onclick="emptyCart()">Vaciar carrito</button>
    `;
    cartContent.innerHTML += emptyCartButton;
}

const cartId = localStorage.getItem('cartId');
if (cartId) {
    socket.emit('getCart', cartId); 
} else {
    document.getElementById('cart-content').innerHTML = '<p>El carrito está vacío.</p>';
}

document.addEventListener('DOMContentLoaded', () => {
    const cartId = localStorage.getItem('cartId');
    const verCarritoLink = document.getElementById('verCarrito');

    if (cartId) {
        verCarritoLink.href = `/api/carts/${cartId}`;
    } else {
        alert('No se ha encontrado un carrito en la sesión actual.');
        verCarritoLink.href = '#';
    }
});
