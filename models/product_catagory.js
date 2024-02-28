module.exports = (sequelize, Sequelize) => {
    const ProductCategory = sequelize.define(
        'ProductCategory',
        {
            productId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            categoryId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            }
        },
        {
            timestamps: false,
            tableName: 'ProductCategory'
        }
    );

    ProductCategory.associate = (models) => {
        ProductCategory.belongsTo(models.Product, {
            foreignKey: 'product_id',
        });
        ProductCategory.belongsTo(models.Category, {
            foreignKey: 'category_id',
        });
    };

    return ProductCategory;
};
