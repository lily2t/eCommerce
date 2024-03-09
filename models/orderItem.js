module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define(
        'OrderItem',
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

    OrderItem.associate = function (models) {
        OrderItem.belongsTo(models.Product);
        OrderItem.belongsTo(models.Order);
    };

    return OrderItem;
};
