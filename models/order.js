module.exports = (sequelize, Sequelize) => {
	const Order = sequelize.define(
		'Order',
		{
			order_number: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			total_amount: {
				type: Sequelize.DataTypes.FLOAT,
				allowNull: false,
			},
			membership_discount: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			timestamps: true,
		}
	);

	Order.associate = function (models) {
		Order.belongsTo(models.User);
		Order.hasMany(models.Order);
	};

	return Order;
};
