module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define(
        'Order',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            orderNumber: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false
            },
            totalAmount: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            membershipId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        },
        {
            timestamps: false
        }
    );

    Order.associate = function (models) {
        Order.belongsTo(models.User, { foreignKey: 'userId' });
        Order.belongsTo(models.Membership, { foreignKey: 'membershipId' });
        Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
    };

    return Order;
};
