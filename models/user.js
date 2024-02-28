module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'User',
        {
            firstname: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            lastname: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: Sequelize.DataTypes.STRING,
            },
            telephonenumber: {
                type: Sequelize.DataTypes.STRING,
            },
        },
        {
            timestamps: true,
        }
    );

    User.associate = function (models) {
        User.belongsTo(models.Role, { foreignKey: 'role_id' });
        User.hasMany(models.Cart);
        User.hasMany(models.Order);
    };

    return User;
};
