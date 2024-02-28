module.exports = (sequelize, Sequelize) => {
	const Order = sequelize.define(
		'Order',
		{
			order_number: {
				type: Sequelize.DataTypes.STRING,
				unique: true,
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
		},
		{
			timestamps: true,
		}
	);

	Order.associate = function (models) {
		Order.belongsTo(models.User);
		Order.belongsTo(models.Membership);
	};

	return Order;
};
