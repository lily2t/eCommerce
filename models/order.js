module.exports = (sequelize, Sequelize) => {
	const Order = sequelize.define(
		'Order',
		{
			orderNumber: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			status: {
				type: Sequelize.DataTypes.ENUM('In Progress', 'Ordered', 'Completed'),
				allowNull: false,
				defaultValue: 'In Progress'
			},
			membershipStatus: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			}
		},
		{
			timestamps: true,
		}
	);

	Order.associate = function (models) {
		Order.belongsTo(models.User);
		Order.hasMany(models.OrderItem);
	};

	return Order;
};
