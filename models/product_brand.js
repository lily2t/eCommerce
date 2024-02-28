module.exports = (sequelize, Sequelize) => {
    const ProductBrand = sequelize.define(
        'ProductBrand',
        {
            productId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            brandId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            }
        },
        {
            timestamps: false,
            tableName: 'ProductBrand'
        }
    );

    ProductBrand.associate = (models) => {
        ProductBrand.belongsTo(models.Product, {
            foreignKey: 'product_id',
        });
        ProductBrand.belongsTo(models.Brand, {
            foreignKey: 'brand_id',
        });
    };

    return ProductBrand;
};
