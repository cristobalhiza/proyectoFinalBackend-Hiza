document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('productListUpdated', (products) => {
        updateProductList(products);
    });

    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const category = document.getElementById('category').value;
        const stock = parseInt(document.getElementById('stock').value, 10);
        const code = document.getElementById('code').value;
        const description = document.getElementById('description').value;

        if (!title || price <= 0 || !category || stock < 0 || !code || !description) {
            alert('Por favor, completa todos los campos');
            return;
        }
        socket.emit('newProduct', { title, price, category, stock, code, description });

        productForm.reset();
    });

    function updateProductList(products) {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${product.title}</strong> - $${product.price}<br/>
                <strong>Código:</strong> ${product.code}<br/>
                <strong>Descripción:</strong> ${product.description}<br/>
                <strong>Categoría:</strong> ${product.category}<br/>
                <strong>Stock:</strong> ${product.stock}<br/>
                <button onclick="deleteProduct('${product._id}')">Eliminar</button>
            `;
            productList.appendChild(li);
        });
    }

    window.deleteProduct = function (productId) {
        socket.emit('deleteProduct', productId);
    };
});
