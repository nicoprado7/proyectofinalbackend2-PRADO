import CartRepository from "../repositories/cart.repository.js";
import ProductService from "./product.service.js";
import TicketService from "./ticket.service.js";
import { ERROR_NOT_FOUND_INDEX } from "../constants/messages.constant.js";

export default class CartService {
    #cartRepository;
    #productService;
    #ticketService;

    constructor() {
        this.#cartRepository = new CartRepository();
        this.#productService = new ProductService();
        this.#ticketService = new TicketService();
    }

    // Obtener todos los carritos aplicando filtros
    async findAll(paramFilters) {
        const $and = [];

        if (paramFilters?.name) $and.push({ name: { $regex: paramFilters.name, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        return await this.#cartRepository.findAll(filters);
    }

    // Obtener un carrito por su ID
    async findOneById(id) {
        return await this.#cartRepository.findOneById(id);
    }

    // Crear un nuevo carrito
    async insertOne(data) {
        return await this.#cartRepository.save(data);
    }

    // Actualizar un carrito existente
    async updateOneById(id, data) {
        const cart = await this.#cartRepository.findOneById(id);
        const newValues = { ...cart, ...data };
        return await this.#cartRepository.save(newValues);
    }

    // Eliminar un carrito por su ID
    async deleteOneById(id) {
        return await this.#cartRepository.deleteOneById(id);
    }

    // Agregar un producto a un carrito o incrementar la cantidad de un producto existente
    async addOneProduct(id, productId, quantity = 0) {
        const cart = await this.#cartRepository.findOneById(id);

        const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await this.#cartRepository.save(cart);
    }

    // Elimina un producto de un carrito o decrementa la cantidad de un producto existente
    async removeOneProduct(id, productId, quantity = 0) {
        const cart = await this.#cartRepository.findOneById(id);

        const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);
        if (productIndex < 0) {
            throw new Error(ERROR_NOT_FOUND_INDEX);
        }

        if (cart.products[productIndex].quantity > quantity) {
            cart.products[productIndex].quantity -= quantity;
        } else {
            cart.products.splice(productIndex, 1);
        }

        return await this.#cartRepository.save(cart);
    }

    // Elimina todos los productos de un carrito por su ID
    async removeAllProducts(id) {
        const cart = await this.#cartRepository.findOneById(id);
        cart.products = [];

        return await this.#cartRepository.save(cart);
    }

    // Finalizar la compra de un carrito
    async purchaseCart(cartId, userEmail) {
        const cart = await this.#getCart(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const { totalAmount, productsNotPurchased } = await this.#processProducts(cart.products);
        await this.#createTicketIfNecessary(totalAmount, userEmail);
        await this.#updateCartProducts(cart, productsNotPurchased);

        return {
            success: totalAmount > 0,
            totalAmount,
            productsNotPurchased,
        };
    }

    async #getCart(cartId) {
        const cart = await this.#cartRepository.findOneById(cartId);
        if (!cart) {
            console.error(`Carrito con ID ${cartId} no encontrado`);
        }
        return cart;
    }

    async #processProducts(products) {
        let totalAmount = 0;
        const productsNotPurchased = [];

        for (const item of products) {
            try {
                const result = await this.#processProduct(item);
                totalAmount += result.totalAmount;
                if (!result.success) {
                    productsNotPurchased.push(item.product.toString());
                }
            } catch (error) {
                console.error(`Error al procesar el producto ${item.product}: ${error.message}`);
                productsNotPurchased.push(item.product.toString());
            }
        }

        return { totalAmount, productsNotPurchased };
    }

    async #processProduct(item) {
        const productId = item.product.toString();
        const product = await this.#productService.findOneById(productId);

        if (!product) {
            console.error(`Producto con ID ${productId} no encontrado`);
            return { totalAmount: 0 };
        }

        if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            if (!product.id) {
                console.error(`El ID del producto ${productId} es undefined`);
                return { totalAmount: 0 };
            }

            const updateResult = await this.#productService.updateOneById(product.id, { stock: product.stock });

            if (updateResult) {
                return { success: true, totalAmount: product.price * item.quantity };
            } else {
                console.error(`No se pudo actualizar el producto ${productId}`);
                return { totalAmount: 0 };
            }
        } else {
            console.error(`Stock insuficiente para el producto ${productId}. Stock disponible: ${product.stock}`);
            return { totalAmount: 0 };
        }
    }
    async #createTicketIfNecessary(totalAmount, userEmail) {
        if (totalAmount > 0) {
            await this.#ticketService.createTicket({
                amount: totalAmount,
                purchaser: userEmail,
                purchaseDatetime: new Date(),
            });
        }
    }

    async #updateCartProducts(cart, productsNotPurchased) {
        cart.products = cart.products.filter((item) => !productsNotPurchased.includes(item.product.toString()));
        await this.#cartRepository.save(cart);
    }
}