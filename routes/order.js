const express = require('express');
const router = express.Router();
const db = require('../models');
const OrderService = require('../services/orderService');
const jsonParser = express.json();

const orderService = new OrderService(db);

router.get('/', async (req, res) => {
    const userId = req.query.userId;

    try {
        const orders = await orderService.getAllOrders(userId);
        res.json({ status: 'success', statuscode: 200, data: { result: 'Orders found', orders } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: error.message } });
    }
});

router.put('/:orderId', jsonParser, async (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;

    try {
        const order = await orderService.updateOrderStatus(orderId, status);
        res.json({ status: 'success', statuscode: 200, data: { result: 'Order status updated successfully', order } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: error.message } });
    }
});

router.post('/', jsonParser, async (req, res) => {
    const { userId, orderNumber, membershipStatus, orderItems } = req.body;

    try {
        const order = await orderService.createOrder(userId, orderNumber, membershipStatus, orderItems);
        res.status(201).json({
            status: 'success',
            statuscode: 201, data: {
                result: 'Order created successfully', order
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status:
                'error', statuscode: 500, data: {
                    result: error.message
                }
        });
    }
});
module.exports = router;
