module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define(
        'Membership',
        {
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            discount_percentage: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            min_items: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            max_items: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            timestamps: true,
        }
    );

    Membership.associate = function (models) {
        Membership.hasMany(models.User);
        Membership.hasMany(models.Order);
    };

    return Membership;
};
