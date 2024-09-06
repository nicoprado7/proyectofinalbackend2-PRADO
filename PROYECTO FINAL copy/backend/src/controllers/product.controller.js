import ProductService from "../services/product.service.js";
import { deleteFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";

export default class ProductController {
    #productService;

    constructor() {
        this.#productService = new ProductService();
    }

    // Obtener todos los productos
    async getAll(req, res) {
        try {
            const products = await this.#productService.findAll(req.query);
            res.sendSuccess200(products);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Obtener un producto por su ID
    async getById(req, res) {
        try {
            const product = await this.#productService.findOneById(req.params.id);
            res.sendSuccess200(product);
        } catch (error) {
            console.error("Error en getById:", error);
            res.sendError(error);
        }
    }

    // Crear un nuevo producto
    async create(req, res) {
        try {
            const product = await this.#productService.insertOne(req.body, req.file?.filename);
            res.sendSuccess201(product);
        } catch (error) {
            console.error("Error en create:", error);
            if (req.file?.filename) await deleteFile(paths.images, req.file.filename);
            res.sendError(error);
        }
    }

    // Actualizar un producto existente
    async update(req, res) {
        try {
            const product = await this.#productService.updateOneById(req.params.id, req.body, req.file?.filename);
            res.sendSuccess200(product);
        } catch (error) {
            console.error("Error en update:", error);
            if (req.file?.filename) await deleteFile(paths.images, req.file.filename);
            res.sendError(error);
        }
    }

    // Eliminar un producto por su ID
    async delete(req, res) {
        try {
            const product = await this.#productService.deleteOneById(req.params.id);
            res.sendSuccess200(product);
        } catch (error) {
            console.error("Error en delete:", error);
            res.sendError(error);
        }
    }
}