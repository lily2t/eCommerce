const express = require('express');
const router = express.Router();
const CartService = require('../services/cartService');
const { authenticateJWT } = require('../middleware/authMiddleware');

// GET all cart items for the logged in user
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await CartService.getCartItemsByUserId(userId);
        res.status(200).json({ status: 'success', statuscode: 200, data: { cartItems } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching cart items.' } });
    }
});

// POST add a product to the logged in user's cart
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'ProductId and quantity are required.' } });
        }
        const addedItem = await CartService.addToCart(userId, productId, quantity);
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Product added to cart.', addedItem } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error adding product to cart.' } });
    }
});

// PUT update quantity of a product in the logged in user's cart
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const cartItemId = req.params.id;
        const { quantity } = req.body;
        if (!quantity) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Quantity is required.' } });
        }
        const updatedItem = await CartService.updateCartItemQuantity(cartItemId, quantity);
        if (!updatedItem) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Cart item not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Cart item quantity updated.', updatedItem } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error updating cart item quantity.' } });
    }
});

// DELETE remove a product from the logged in user's cart
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const cartItemId = req.params.id;
        const removedItem = await CartService.removeCartItem(cartItemId);
        if (!removedItem) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Cart item not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Cart item removed.', removedItem } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error removing cart item.' } });
    }
});

module.exports = router;
