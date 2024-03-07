module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'User',
        {
            firstName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            userName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            EncryptedPassword: {
                type: Sequelize.DataTypes.BLOB,
                allowNull: false,
            },
            Salt: {
                type: Sequelize.DataTypes.BLOB,
                // allowNull: false,
            },
            address: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            telephoneNumber: {
                type: Sequelize.DataTypes.STRING,
                // allowNull: false,
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
