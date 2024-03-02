class OrderService {
    constructor(db) {
        this.Order = db.Order;
    }

    async getByUserId(userId) {
        return this.Order.findAll({ where: { userId } });
    }

    async getAll() {
        return this.Order.findAll();
    }

    async create(userId, status, totalAmount) {
        return this.Order.create({ userId, status, totalAmount });
    }

    async update(orderId, status) {
        const [updatedRowsCount] = await this.Order.update({ status }, { where: { id: orderId } });

        if (updatedRowsCount === 0) {
            throw new Error("Order not found or not updated");
        }

        return this.getOrderById(orderId);
    }

    async getOrderById(orderId) {
        return this.Order.findByPk(orderId);
    }
}

module.exports = OrderService;
