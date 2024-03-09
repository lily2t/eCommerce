class ProductService {
    constructor(db) {
        this.Product = db.Product;
        this.Brand = db.Brand;
        this.Category = db.Category;
    }

    async getAllProducts() {
        return this.Product.findAll({
            include: [
                { model: this.Brand, attributes: ['name'] },
                { model: this.Category, attributes: ['name'] }
            ]
        });
    }

    async addProduct(name, description, unitPrice, discount, date_added, imgurl, quantity, BrandId, CategoryId) {
        return this.Product.create({
            name,
            description,
            unitPrice,
            discount,
            date_added,
            imgurl,
            quantity,
            BrandId,
            CategoryId
        });
    }

    async updateProduct(productId, updatedFields) {
        const product = await this.Product.findByPk(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        await product.update(updatedFields);
        return product;
    }

    async softDeleteProduct(productId) {
        const product = await this.Product.findByPk(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        product.isDeleted = true;
        await product.save();
        return product;
    }
}

module.exports = ProductService;
