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
                allowNull: false,
            },
            unitPrice: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false,
            },
            discount: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            date_added: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            imgurl: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            isDeleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            timestamps: true,
        }
    );

    Product.associate = function (models) {
        Product.belongsTo(models.Brand);
        Product.belongsTo(models.Category);
        Product.hasMany(models.Cart);
        Product.hasMany(models.OrderItem);
    };

    return Product;
};
