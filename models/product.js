module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define(
        'Product',
        {
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.DataTypes.TEXT,
            },
            unitprice: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false,
            },
            discount: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false,
            },
            date_added: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            imgurl: {
                type: Sequelize.DataTypes.STRING,
            },
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            isdeleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            timestamps: true,
        }
    );

    Product.associate = function (models) {
        Product.belongsTo(models.Brand, { foreignKey: 'brand_id' });
        Product.belongsTo(models.Category, { foreignKey: 'category_id' });
        Product.hasMany(models.CartItem);
        Product.hasMany(models.OrderItem);
    };

    return Product;
};
