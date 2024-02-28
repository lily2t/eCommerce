module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define(
        'Membership',
        {
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            min_purchase_quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            max_purchase_quantity: {
                type: Sequelize.DataTypes.INTEGER,
            },
            discount_percentage: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Membership.associate = function (models) {
        Membership.hasMany(models.Order);
    };

    return Membership;
};
