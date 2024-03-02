module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define(
        'Brand',
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

    Brand.associate = function (models) {
        Brand.hasMany(models.Product);
    };

    return Brand;
};
