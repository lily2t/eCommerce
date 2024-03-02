module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'User',
        {
            username: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            firstName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            telephoneNumber: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: true,
        }
    );

    User.associate = function (models) {
        User.belongsTo(models.Role);
        User.hasMany(models.Cart);
        User.hasMany(models.Order);
    };

    return User;
};
