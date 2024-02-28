module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define(
        'Role',
        {
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Role.associate = function (models) {
        Role.hasMany(models.User);
    };

    return Role;
};
