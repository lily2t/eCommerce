class ProductService {
    constructor(db) {
        this.Product = db.Product;
    }

    async getAllProducts() {
        return this.Product.findAll();
    }

    async createProduct(productDetails) {
        return this.Product.create(productDetails);
    }

    async updateProduct(productId, newProductDetails) {
        const existingProduct = await this.Product.findByPk(productId);

        if (!existingProduct) {
            throw new Error("Product not found");
        }

        await existingProduct.update(newProductDetails);
        return this.getProductById(productId);
    }

    async getProductById(productId) {
        return this.Product.findByPk(productId);
    }

    async deleteProduct(productId) {
        const deletedRowCount = await this.Product.destroy({ where: { id: productId } });
        if (deletedRowCount === 0) {
            throw new Error("Product not found");
        }
    }
}

module.exports = ProductService;
