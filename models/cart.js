module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define(
        'Cart',
        {
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            unitPrice: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            timestamps: true,
        }
    );

    Cart.associate = function (models) {
        Cart.belongsTo(models.Product);
        Cart.belongsTo(models.User);
    };

    return Cart;
};
