# Proyecto Final Backend - Carrito de Compras
Cristobal Hiza - 2024
## Descripción

Este proyecto es una aplicación de comercio electrónico para gestionar productos y carritos de compras. Permite a los usuarios agregar, actualizar, eliminar productos de su carrito de compras y también vaciarlo completamente. El proyecto incluye tanto una interfaz de usuario con `handlebars` como un backend construido con `Node.js`, `Express`, `MongoDB`, `Mongoose` y `WebSockets` para la actualización en tiempo real de los productos en el carrito.

### Características principales

- Listado de productos.
- Agregar productos al carrito.
- Actualización de cantidades de productos en el carrito.
- Eliminación de productos individuales o de todo el carrito.
- Actualización en tiempo real usando WebSockets.
- Paginación para productos.

## Tecnologías Utilizadas

- **Backend**: Node.js, Express, Socket.io
- **Base de datos**: MongoDB, Mongoose (ODM para MongoDB)
- **Frontend**: Handlebars (templates dinámicos)
- **Websockets**: Comunicación en tiempo real con Socket.io

---

## Requisitos Previos

Asegúrate de tener las siguientes herramientas instaladas:

- **Node.js** (v14 o superior)
- **MongoDB** (Puedes usar MongoDB Atlas o una instancia local)
- **npm** (v6 o superior)

---

## Instalación

1. Clona este repositorio en tu máquina local:

    ```bash
    git clone https://github.com/tu-usuario/proyecto-backend-carrito.git
    ```

2. Dirígete a la carpeta del proyecto:

    ```bash
    cd proyectoFinalBackend-Hiza
    ```

3. Instala las dependencias necesarias ejecutando el siguiente comando:

    ```bash
    npm install
    ```

4. Configura las variables de entorno. Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

    ```bash
    MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/<nombre_db>?retryWrites=true&w=majority
    PORT=8080
    ```

   Cambia `<usuario>`, `<contraseña>`, y `<nombre_db>` por los valores reales de tu base de datos.

---

## Uso

1. Inicia el servidor ejecutando el siguiente comando:

    ```bash
    npm start
    ```

2. Abre tu navegador web y ve a `http://localhost:8080` para ver la aplicación en acción.

---

## Funcionalidades

### Listado de Productos

Al entrar en la aplicación, se te mostrará un listado de productos disponibles. Puedes paginar los productos utilizando las opciones de "Mostrar productos por página".

### Agregar al Carrito

Cada producto tiene un botón para agregarlo al carrito. Puedes elegir la cantidad y hacer clic en **Agregar al carrito**. Esto enviará la solicitud para agregar el producto a tu carrito.

### Ver Carrito

El carrito puede visualizarse haciendo clic en el enlace **Ver Carrito** en el encabezado. Aquí podrás:

- Ver los productos en tu carrito.
- Actualizar las cantidades de los productos.
- Eliminar productos individuales.
- Vaciar todo el carrito de una sola vez.

### Actualización en Tiempo Real

Gracias a WebSockets (Socket.io), el carrito y el listado de productos se actualizan en tiempo real, lo que significa que no es necesario actualizar la página manualmente para ver los cambios en tu carrito o en la lista de productos.

---

## Estructura del Proyecto

- **src/**: Contiene la lógica principal del servidor, los controladores y los modelos.
  - **dao/**: Contiene los gestores de bases de datos como `productsManager.js` y `cartsManager.js`.
  - **models/**: Define los modelos de datos de MongoDB (`Product`, `Cart`).
  - **routes/**: Define las rutas de la aplicación para productos y carritos.
  - **views/**: Contiene las vistas de handlebars (`home.handlebars`, `cart.handlebars`).

- **public/**: Contiene los archivos estáticos como CSS y JavaScript.
  - **js/index.js**: Lógica del frontend, encargada de la interacción con Socket.io y las actualizaciones en tiempo real.

---

## API Endpoints

### Productos

- `GET /products`: Obtiene el listado de productos con paginación.
- `POST /api/products`: Crea un nuevo producto (solo en modo administrador).
- `DELETE /api/products/:id`: Elimina un producto (solo en modo administrador).

### Carrito

- `GET /api/carts/:cid`: Obtiene el contenido del carrito.
- `POST /api/carts/:cid/product/:pid`: Agrega un producto al carrito.
- `DELETE /api/carts/:cid/product/:pid`: Elimina un producto del carrito.
- `DELETE /api/carts/:cid`: Vacía el carrito.

---

## Modo de Desarrollo

Si deseas ejecutar el proyecto en modo de desarrollo con reinicios automáticos, puedes usar `nodemon`:

```bash
npm run dev
