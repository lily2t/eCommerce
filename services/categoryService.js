class CategoryService {
    constructor(db) {
        this.Category = db.Category;
    }

    async getAll() {
        return this.Category.findAll();
    }

    async getById(categoryId) {
        return this.Category.findByPk(categoryId);
    }

    async create(name) {
        return this.Category.create({ name });
    }

    async update(categoryId, name) {
        const [updatedRowsCount] = await this.Category.update({ name }, { where: { id: categoryId } });

        if (updatedRowsCount === 0) {
            throw new Error("Category not found or not updated");
        }

        return this.getById(categoryId);
    }

    async delete(categoryId) {
        const category = await this.getById(categoryId);

        if (!category) {
            throw new Error("Category not found");
        }

        await category.destroy();
    }
}

module.exports = CategoryService;
