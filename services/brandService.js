class BrandService {
    constructor(db) {
        this.Brand = db.Brand;
    }

    async getAllBrands() {
        return this.Brand.findAll();
    }

    async getBrandById(brandId) {
        return this.Brand.findByPk(brandId);
    }

    async createBrand(name) {
        return this.Brand.create({ name });
    }

    async updateBrand(brandId, name) {
        const [updatedRowsCount] = await this.Brand.update({ name }, { where: { id: brandId } });

        if (updatedRowsCount === 0) {
            throw new Error("Brand not found or not updated");
        }

        return this.getById(brandId);
    }

    async deleteBrand(brandId) {
        const brand = await this.getById(brandId);

        if (!brand) {
            throw new Error("Brand not found");
        }

        await brand.destroy();
    }
}

module.exports = BrandService;
