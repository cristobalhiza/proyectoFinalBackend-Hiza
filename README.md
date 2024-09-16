# Proyecto Final Backend - Hiza

Este es el proyecto final de backend de Cristóbal Hiza para el curso de Backend. El proyecto incluye la gestión de productos y carritos de compra utilizando Node.js, Express, MongoDB, y WebSocket para la actualización en tiempo real.

## Funcionalidades

- **Gestión de productos**: CRUD completo (crear, leer, actualizar, eliminar) de productos.
- **Gestión de carritos**: Permite agregar, eliminar y actualizar productos en carritos de compra.
- **Paginación**: Implementación de paginación para mostrar productos en el frontend.
- **WebSockets**: Actualización en tiempo real de productos y carritos.
- **Persistencia en MongoDB**: Los productos y carritos se almacenan en una base de datos MongoDB.

## Requisitos

- Node.js (v14 o superior)
- MongoDB

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/usuario/proyectoFinalBackend-Hiza.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd proyectoFinalBackend-Hiza
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

4. Inicializa la base de datos con datos de prueba (opcional):

   ```bash
   node src/seed.js
   ```

## Ejecución

Para iniciar el servidor en modo de desarrollo, utiliza el siguiente comando:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8080`.

## Rutas Principales

### Productos (API)

- `GET /api/products`: Devuelve todos los productos con paginación.
- `POST /api/products`: Crea un nuevo producto.
- `PUT /api/products/:id`: Actualiza un producto existente.
- `DELETE /api/products/:id`: Elimina un producto por su ID.

### Carritos (API)

- `POST /api/carts/create/product/:pid`: Crea un carrito nuevo y añade un producto.
- `PUT /api/carts/:cid`: Actualiza un carrito con un arreglo de productos.
- `PUT /api/carts/:cid/products/:pid`: Actualiza la cantidad de un producto en el carrito.
- `DELETE /api/carts/:cid/products/:pid`: Elimina un producto del carrito.
- `DELETE /api/carts/:cid`: Vacía un carrito.

### Vistas

- `GET /products`: Muestra una lista de productos con paginación y opciones de ordenamiento.
- `GET /realtimeproducts`: Gestiona productos en tiempo real (crear, actualizar, eliminar).

## Tecnologías Utilizadas

- **Node.js**: Plataforma de desarrollo.
- **Express.js**: Framework web para Node.js.
- **MongoDB**: Base de datos NoSQL para almacenar productos y carritos.
- **Mongoose**: ODM para MongoDB.
- **Socket.io**: Comunicación en tiempo real.
- **Handlebars**: Motor de plantillas para las vistas.
- **mongoose-paginate-v2**: usado para paginación
