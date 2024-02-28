module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define(
        'Cart',
        {
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            unit_price: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            timestamps: true,
        }
    );

    Cart.associate = function (models) {
        Cart.belongsTo(models.User);
        Cart.belongsTo(models.Product);
    };

    return Cart;
};
