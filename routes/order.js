const express = require('express');
const router = express.Router();
const db = require('../models');
const OrderService = require('../services/orderService');
const { authenticateJWT, isRegistered, isAdmin } = require('../middleware/authMiddleware.js');
const jsonParser = express.json();

const orderService = new OrderService(db);

router.get('/', authenticateJWT, isRegistered, async (req, res) => {
    /* #swagger.tags = ['Orders']
       #swagger.description = "Get all orders."
       #swagger.parameters['userId'] = {
           "name": "userId",
           "in": "query",
           "required": true,
           "type": "integer"
       } */
    const userId = req.query.userId;

    try {
        const orders = await orderService.getAllOrders(userId);
        res.json({ status: 'success', statuscode: 200, data: { result: 'Orders found', orders } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: error.message } });
    }
});

router.put('/:orderId', authenticateJWT, isAdmin, jsonParser, async (req, res) => {
    /* #swagger.tags = ['Orders']
       #swagger.description = "Update order status by ID."
       #swagger.parameters['orderId'] = {
           "name": "orderId",
           "in": "path",
           "required": true,
           "type": "integer"
       }
       #swagger.parameters['body'] = {
           in: "body",
           description: "Updated order status.",
           required: true,
           schema: {
               $ref: "#/definitions/UpdateOrderStatusRequest"
           }
       } */
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

router.post('/', authenticateJWT, isRegistered, jsonParser, async (req, res) => {
    /* #swagger.tags = ['Orders']
       #swagger.description = "Create a new order."
       #swagger.parameters['body'] = {
           in: "body",
           description: "Order details to be added.",
           required: true,
           schema: {
               $ref: "#/definitions/CreateOrderRequest"
           }
       } */
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
