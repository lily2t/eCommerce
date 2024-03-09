class CategoryService {
    constructor(db) {
        this.Category = db.Category;
        this.Product = db.Product;
    }

    async getAllCategories() {
        return this.Category.findAll();
    }

    async addCategory(name) {
        return this.Category.create({ name });
    }

    async updateCategory(categoryId, updatedFields) {
        const category = await this.Category.findByPk(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        await category.update(updatedFields);
        return category;
    }

    async deleteCategory(categoryId) {
        const category = await this.Category.findByPk(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }

        const productsInCategory = await this.Product.findAll({ where: { CategoryId: categoryId } });
        if (productsInCategory.length > 0) {
            throw new Error("Category has assigned products and cannot be deleted");
        }

        await category.destroy();
        return category;
    }
}

module.exports = CategoryService;
