// BrandService.js
class BrandService {
    constructor(db) {
        this.Brand = db.Brand;
    }

    async getAllBrands() {
        return this.Brand.findAll();
    }

    async createBrand(brandDetails) {
        return this.Brand.create(brandDetails);
    }

    async updateBrand(brandId, newBrandDetails) {
        const existingBrand = await this.Brand.findByPk(brandId);

        if (!existingBrand) {
            throw new Error("Brand not found");
        }

        await existingBrand.update(newBrandDetails);
        return this.getBrandById(brandId);
    }

    async getBrandById(brandId) {
        return this.Brand.findByPk(brandId);
    }

    async deleteBrand(brandId) {
        const deletedRowCount = await this.Brand.destroy({ where: { id: brandId } });
        if (deletedRowCount === 0) {
            throw new Error("Brand not found");
        }
    }
}

module.exports = BrandService;
