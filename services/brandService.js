class BrandService {
    constructor(db) {
        this.Brand = db.Brand;
        this.Product = db.Product;
    }

    async getAllBrands() {
        return this.Brand.findAll();
    }

    async addBrand(name) {
        return this.Brand.create({ name });
    }

    async updateBrand(brandId, updatedFields) {
        const brand = await this.Brand.findByPk(brandId);
        if (!brand) {
            throw new Error("Brand not found");
        }
        await brand.update(updatedFields);
        return brand;
    }

    async deleteBrand(brandId) {
        const brand = await this.Brand.findByPk(brandId);
        if (!brand) {
            throw new Error("Brand not found");
        }

        const productsWithBrand = await this.Product.findAll({
            where: { BrandId: brandId }
        });
        if (productsWithBrand.length > 0) {
            throw new Error("Brand has assigned products and cannot be deleted");
        }

        await brand.destroy();
        return brand;
    }
}

module.exports = BrandService;
