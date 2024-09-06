import CartService from "../services/cart.service.js";

export default class CartController {
    #cartService;

    constructor() {
        this.#cartService = new CartService();
    }

    // Obtener todos los carritos
    async getAll(req, res) {
        try {
            const carts = await this.#cartService.findAll(req.query);
            res.sendSuccess200(carts);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Obtener un carrito por su ID
    async getById(req, res) {
        try {
            const cart = await this.#cartService.findOneById(req.params.id);
            res.sendSuccess200(cart);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Crear un nueva carrito
    async create(req, res) {
        try {
            const cart = await this.#cartService.insertOne(req.body);
            res.sendSuccess201(cart);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Actualizar un carrito existente
    async update(req, res) {
        try {
            const cart = await this.#cartService.updateOneById(req.params.id, req.body);
            res.sendSuccess200(cart);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Eliminar un carrito por su ID
    async delete(req, res) {
        try {
            const cart = await this.#cartService.deleteOneById(req.params.id);
            res.sendSuccess200(cart);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Agrega un producto a un carrito específico
    async addOneProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const cartUpdated = await this.#cartService.addOneProduct(cid, pid, quantity ?? 1);
            res.sendSuccess200(cartUpdated);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Elimina un producto específico de un carrito
    async removeOneProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            const cartDeleted = await this.#cartService.removeOneProduct(cid, pid, 1);
            res.sendSuccess200(cartDeleted);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Elimina todos los productos de un carrito específico
    async removeAllProducts(req, res) {
        try {
            const cartDeleted = await this.#cartService.removeAllProducts(req.params.cid);
            res.sendSuccess200(cartDeleted);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Finalizar la compra de un carrito
    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const { user } = req;
            const purchaseResult = await this.#cartService.purchaseCart(cid, user.email);
            res.sendSuccess200(purchaseResult);
        } catch (error) {
            res.sendError(error);
        }
    }
}