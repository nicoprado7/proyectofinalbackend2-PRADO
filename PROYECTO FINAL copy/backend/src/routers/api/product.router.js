import BaseRouter from "../base.router.js";
import ProductController from "../../controllers/product.controller.js";
import { ADMIN, STANDARD } from "../../constants/roles.constant.js";
import uploader from "../../utils/uploader.js";

export default class ProductRouter extends BaseRouter {
    #productController;

    constructor() {
        super();
        this.#productController = new ProductController();
        this.initialize();
    }

    initialize() {
        const router = this.getRouter();

        // Ruta para obtener todos los productos
        this.addGetRoute("/", [ STANDARD, ADMIN ], async (req, res) => {
            try {
                await this.#productController.getAll(req, res);
            } catch (error) {
                res.status(500).send("Error interno del servidor");
            }
        });

        // Ruta para obtener un producto por ID
        this.addGetRoute("/:id", [STANDARD], async (req, res) => {
            try {
                await this.#productController.getById(req, res);
            } catch (error) {
                res.status(500).send("Error interno del servidor");
            }
        });

        // Ruta para crear un producto
        this.addPostRoute("/", [ADMIN], uploader.single("file"), async (req, res) => {
            try {
                await this.#productController.create(req, res);
            } catch (error) {
                res.status(500).send("Error interno del servidor");
            }
        });

        // Ruta para actualizar un producto por ID
        this.addPutRoute("/:id", [ADMIN], uploader.single("file"), async (req, res) => {
            try {
                await this.#productController.update(req, res);
            } catch (error) {
                res.status(500).send("Error interno del servidor");
            }
        });

        // Ruta para eliminar un producto por ID
        this.addDeleteRoute("/:id", [ADMIN], async (req, res) => {
            try {
                await this.#productController.delete(req, res);
            } catch (error) {
                res.status(500).send("Error interno del servidor");
            }
        });

        // Middleware para manejar errores
        router.use((err, req, res /* next */) => {
            res.status(500).send("Error en el servidor");
        });
    }
}