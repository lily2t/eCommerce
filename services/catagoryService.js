class CategoryService {
    constructor(db) {
        this.Category = db.Category;
    }

    async getAllCategories() {
        return this.Category.findAll();
    }

    async createCategory(categoryDetails) {
        return this.Category.create(categoryDetails);
    }

    async updateCategory(categoryId, newCategoryDetails) {
        const existingCategory = await this.Category.findByPk(categoryId);

        if (!existingCategory) {
            throw new Error("Category not found");
        }

        await existingCategory.update(newCategoryDetails);
        return this.getCategoryById(categoryId);
    }

    async getCategoryById(categoryId) {
        return this.Category.findByPk(categoryId);
    }

    async deleteCategory(categoryId) {
        const deletedRowCount = await this.Category.destroy({ where: { id: categoryId } });
        if (deletedRowCount === 0) {
            throw new Error("Category not found");
        }
    }
}

module.exports = CategoryService;
