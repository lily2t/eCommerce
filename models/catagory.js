module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define(
        'Category',
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

    Category.associate = function (models) {
        Category.hasMany(models.Product);
    };

    return Category;
};
