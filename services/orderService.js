const MembershipService = require('./membershipService.js');

class OrderService {
    constructor(db) {
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.MembershipService = new MembershipService(db);
    }

    async getAllOrders(userId) {
        if (userId) {
            return this.Order.findAll({
                where: {
                    UserId: userId
                }
            });
        } else {
            return this.Order.findAll();
        }
    }

    async updateOrderStatus(orderId, status) {
        const order = await this.Order.findByPk(orderId);
        if (!order) {
            throw new Error("Order not found");
        }

        order.status = status;
        await order.save();
        return order;
    }

    async createOrder(userId, orderNumber, membershipStatus, orderItems) {
        const order = await this.Order.create({
            UserId: userId,
            orderNumber: orderNumber,
            membershipStatus: membershipStatus
        });

        const totalItemsPurchased = orderItems
            .reduce((acc, item) => acc + item.quantity, 0);
        await this.MembershipService
            .updateMembershipStatus(userId, totalItemsPurchased);

        for (const orderItem of orderItems) {
            await this.OrderItem.create({
                OrderId: order.id,
                ProductId: orderItem.productId,
                quantity: orderItem.quantity,
                unitPrice: orderItem.unitPrice
            });
        }

        return order;
    }

    async deleteOrder(orderId) {
        const order = await this.Order.findByPk(orderId);
        if (!order) {
            throw new Error("Order not found");
        }

        await order.destroy();
        return order;
    }
}

module.exports = OrderService;
