const express = require('express');
const router = express.Router();
const db = require('../models');
const CartService = require('../services/cartService');
const { authenticateJWT, isRegistered } = require('../middleware/authMiddleware.js');
const jsonParser = express.json();

const cartService = new CartService(db);

router.post('/', jsonParser, authenticateJWT, isRegistered, async (req, res) => {
    /* #swagger.tags = ['Cart']
       #swagger.description = "Add a product to the cart."
       #swagger.parameters['body'] = {
           in: "body",
           description: "Product details to be added to the cart.",
           required: true,
           schema: {
               $ref: "#/definitions/AddToCartRequest"
           }
       } */
    const { userId, productId, quantity } = req.body;

    try {
        const cartItem = await cartService.addToCart(userId, productId, quantity);
        res.status(201).json({
            status: 'success',
            statuscode: 201, data: { result: 'Product added to cart successfully', cartItem }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: error.message }
        });
    }
});

router.get('/', authenticateJWT, isRegistered, async (req, res) => {
    /* #swagger.tags = ['Cart']
       #swagger.description = "Get all cart items for a user."
       #swagger.parameters['query'] = {
           in: "query",
           name: "userId",
           description: "User ID for which to fetch cart items.",
           required: true,
           type: "integer"
       } */
    const userId = req.query.userId;

    try {
        const cartItems = await cartService.getCartItems(userId);
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Cart items found', cartItems }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: error.message }
        });
    }
});

router.put('/:cartItemId', authenticateJWT, isRegistered, jsonParser, async (req, res) => {
    /* #swagger.tags = ['Cart']
       #swagger.description = "Update a cart item by ID."
       #swagger.parameters['cartItemId'] = {
           "name": "cartItemId",
           "in": "path",
           "required": true,
           "type": "integer"
       }
       #swagger.parameters['body'] = {
           in: "body",
           description: "Updated cart item details.",
           required: true,
           schema: {
               $ref: "#/definitions/UpdateCartItemRequest"
           }
       } */
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;

    try {
        const cartItem = await cartService.updateCartItem(cartItemId, quantity);
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Cart item updated successfully', cartItem }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: error.message }
        });
    }
});

router.delete('/:cartItemId', authenticateJWT, isRegistered, async (req, res) => {
    /* #swagger.tags = ['Cart']
       #swagger.description = "Delete a cart item by ID."
       #swagger.parameters['cartItemId'] = {
           "name": "cartItemId",
           "in": "path",
           "required": true,
           "type": "integer"
       } */
    const cartItemId = req.params.cartItemId;

    try {
        const cartItem = await cartService.deleteCartItem(cartItemId);
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Cart item deleted successfully', cartItem }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: error.message }
        });
    }
});

module.exports = router;
