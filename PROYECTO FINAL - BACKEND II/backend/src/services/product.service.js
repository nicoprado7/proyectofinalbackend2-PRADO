import ProductRepository from "../repositories/product.repository.js";
import { deleteFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";

export default class ProductService {
    #productRepository;

    constructor() {
        this.#productRepository = new ProductRepository();
    }

    // Obtener todos los productos aplicando filtros
    async findAll(params) {
        return await this.#productRepository.findAll(params);
    }

    // Obtener un producto por su ID
    async findOneById(id) {
        return await this.#productRepository.findOneById(id);
    }

    // Crear un nuevo producto
    async insertOne(data, filename) {
        return await this.#productRepository.save({
            ...data,
            thumbnail: filename ?? null,
        });
    }

    // Actualizar un producto existente
    async updateOneById(id, data, filename) {
        // Asegúrate de que id es un string válido antes de la búsqueda
        if (!id || typeof id !== "string") {
            throw new Error("ID de producto inválido");
        }

        const currentProduct = await this.#productRepository.findOneById(id);

        if (!currentProduct) {
            throw new Error("Producto no encontrado");
        }

        const currentThumbnail = currentProduct.thumbnail;
        const newThumbnail = filename;

        // Actualiza el producto con los nuevos datos
        const product = await this.#productRepository.updateOneById(id, {
            ...data,
            thumbnail: newThumbnail ?? currentThumbnail,
        });

        if (!product) {
            throw new Error("Error al actualizar el producto");
        }

        // Elimina el archivo antiguo si se ha cambiado el thumbnail
        if (filename && newThumbnail !== currentThumbnail) {
            await deleteFile(paths.images, currentThumbnail);
        }

        return product;
    }

    // Eliminar un producto por su ID
    async deleteOneById(id) {
        // Asegúrate de que id es un string válido antes de la eliminación
        if (!id || typeof id !== "string") {
            throw new Error("ID de producto inválido");
        }

        return await this.#productRepository.deleteOneById(id);
    }
}