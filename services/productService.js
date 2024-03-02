class ProductService {
    constructor(db) {
        this.Product = db.Product;
    }

    async getAllProducts() {
        return this.Product.findAll();
    }

    async getProductById(productId) {
        return this.Product.findByPk(productId);
    }

    async createProduct(name, description, unitPrice, brandId, categoryId, imageUrl, quantity) {
        return this.Product.create({ name, description, unitPrice, brandId, categoryId, imageUrl, quantity });
    }

    async updateProduct(productId, name, description, unitPrice, brandId, categoryId, imageUrl, quantity) {
        const [updatedRowsCount] = await this.Product.update(
            { name, description, unitPrice, brandId, categoryId, imageUrl, quantity },
            { where: { id: productId } }
        );

        if (updatedRowsCount === 0) {
            throw new Error("Product not found or not updated");
        }

        return this.getById(productId);
    }

    async deleteProduct(productId) {
        const product = await this.getById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        await product.destroy();
    }
}

module.exports = ProductService;
