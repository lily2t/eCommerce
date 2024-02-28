class OrderService {
    constructor(db) {
        this.Order = db.Order;
    }

    async getAllOrders() {
        return this.Order.findAll();
    }

    async createOrder(orderDetails) {
        return this.Order.create(orderDetails);
    }

    async updateOrder(orderId, newOrderDetails) {
        const existingOrder = await this.Order.findByPk(orderId);

        if (!existingOrder) {
            throw new Error("Order not found");
        }

        await existingOrder.update(newOrderDetails);
        return this.getOrderById(orderId);
    }

    async getOrderById(orderId) {
        return this.Order.findByPk(orderId);
    }

    async deleteOrder(orderId) {
        const deletedRowCount = await this.Order.destroy({ where: { id: orderId } });
        if (deletedRowCount === 0) {
            throw new Error("Order not found");
        }
    }
}

module.exports = OrderService;
