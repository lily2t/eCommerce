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
            timestamps: true,
        }
    );

    Role.associate = function (models) {
        Role.hasMany(models.User);
    };

    return Role;
};
