# Proyecto de Carrito de Compras y Gestión de Productos

# Autor: Nicolás Prado

Este proyecto es una aplicación backend para la gestión de carritos de compra, productos y generación de tickets de compra, construido en **Node.js** y utilizando **Express.js**. La arquitectura sigue el patrón de diseño de repositorio y utiliza un sistema modular con controladores, servicios, repositorios y DAOs.

## Tabla de Contenidos

  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Descripción](#descripción)
  - [Características](#características)
  - [Instalación](#instalación)
    - [Ejemplo de rutas](#ejemplo-de-rutas)
      - [Productos](#productos)
      - [Carrito](#carrito)
  - [Rutas Disponibles](#rutas-disponibles)
    - [Productos](#productos-1)
    - [Carritos](#carritos)
    - [Tickets](#tickets)

## Descripción

El proyecto incluye funcionalidades para:

- Gestión de productos (crear, leer, actualizar, eliminar).
- Gestión de carritos de compras y sus productos.
- Finalización de compras con la generación de tickets.
- Manejo de roles de usuario (ADMIN, PREMIUM, STANDARD).

El sistema permite la autenticación y el control de permisos, asegurando que solo usuarios con los roles apropiados puedan acceder o modificar los recursos.

## Características

- **Autenticación basada en roles:** Permite que usuarios con roles específicos puedan acceder a distintas funcionalidades (ej., administración de productos, compra de productos, etc.).
- **Filtros avanzados:** Búsqueda y filtrado de productos y carritos.
- **Gestión de compras:** Al finalizar una compra, se genera un ticket con el total de la compra y los productos adquiridos.
- **Carga de archivos:** Utiliza un sistema de carga de imágenes para los productos.
- **Errores personalizados:** Respuestas claras y adaptadas a errores de validación y permisos.

## Instalación

1. Clona este repositorio:

    ```bash
    git clone https://github.com/nicoprado7/proyectofinalbackend2-PRADO.git
    ```

2. Entra en el directorio del proyecto:


3. Instala las dependencias:

    ```bash
    npm install
    ```

4. Configura las variables de entorno en un archivo `.env` (crea el archivo si no existe):

    ```plaintext
    MONGODB_URI=mongodb://localhost:27017/mi-base-de-datos
    PORT=3000
    JWT_SECRET=tu-secreto-jwt
    ```

5. Inicia el servidor:

    ```
    npm run dev
    ```
    ```bash
    npm start
    ```

### Ejemplo de rutas

#### Productos

- **GET** `/products`: Obtener todos los productos.
- **POST** `/products`: Crear un nuevo producto (solo ADMIN).
- **GET** `/products/:id`: Obtener un producto por su ID.
- **PUT** `/products/:id`: Actualizar un producto por su ID
- **DELETE** `/products/:id`: Eliminar un producto por su ID

#### Carrito

- **GET** `/cart`: Obtener todos los carritos.
- **POST** `/cart`: Crear un nuevo carrito.
- **GET** `/cart/:id`: Obtener un carrito por su ID.
- **PUT** `/cart/:id`: Actualizar un carrito por su ID.
- **DELETE** `/cart/:id`: Eliminar un carrito por su ID.
- **POST** `/cart/:cid/purchase`: Finalizar la compra de un carrito.

## Rutas Disponibles

### Productos

- **GET** `/products`: Listar productos aplicando filtros como título.
- **POST** `/products`: Crear un nuevo producto con la posibilidad de cargar imágenes.
- **PUT** `/products/:id`: Actualizar un producto por ID.
- **DELETE** `/products/:id`: Eliminar un producto por ID.

### Carritos

- **GET** `/cart`: Listar todos los carritos.
- **POST** `/cart`: Crear un nuevo carrito.
- **PUT** `/cart/:cid/products/:pid`: Agregar productos a un carrito.
- **POST** `/cart/:cid/purchase`: Finalizar la compra de un carrito.

### Tickets

- **POST** `/tickets`: Crear un ticket después de finalizar la compra.
