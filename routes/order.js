const express = require('express');
const router = express.Router();
const OrderService = require('../services/orderService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');

// GET all orders for the logged in user OR all orders for all users if an admin user is logged in
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdminUser = req.user.role === 'Admin';
        const orders = isAdminUser ? await OrderService.getAllOrders() : await OrderService.getOrdersByUserId(userId);
        res.status(200).json({ status: 'success', statuscode: 200, data: { orders } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching orders.' } });
    }
});

// PUT change an order status (admin only)
router.put('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Status is required.' } });
        }
        const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
        if (!updatedOrder) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Order not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Order status updated.', updatedOrder } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error updating order status.' } });
    }
});

module.exports = router;
