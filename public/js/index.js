
const socket = io();

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


socket.on('products', (products) => {
    updateProductList(products);
});

const productForm = document.getElementById('product-form') || document.getElementById('productForm');
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const title = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);

        if (!title || isNaN(price) || price <= 0) {
            alert("Por favor, ingresa un título válido y un precio mayor a 0.");
            return;
        }

        socket.emit('newProduct', { title, price }); 
        productForm.reset();
    });
}

const deleteForm = document.getElementById('delete-form');
if (deleteForm) {
    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productId = parseInt(document.getElementById('product-id').value);

        if (isNaN(productId) || productId <= 0) {
            alert("Por favor, ingresa un ID de producto válido.");
            return;
        }

        socket.emit('deleteProduct', productId);
        deleteForm.reset();
    });
}

function deleteProduct(productId) {
    console.log(`Deleting product with ID: ${productId}`);
    socket.emit('deleteProduct', productId); 
}

socket.on('productError', (errorMessage) => {
    alert("Error: " + errorMessage);
});

socket.on('productListUpdated', (products) => {
    updateProductList(products);
});
