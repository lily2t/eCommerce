const express = require('express');
const router = express.Router();
const ProductService = require('../services/productService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Products found', products } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching products.' } });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Product not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Product found', product } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching product.' } });
    }
});

// POST new product
router.post('/', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const newProduct = req.body;
        const createdProduct = await ProductService.createProduct(newProduct);
        res.status(201).json({ status: 'success', statuscode: 201, data: { result: 'Product created', product: createdProduct } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error creating product.' } });
    }
});

// PUT update product by ID
router.put('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.body;
        const product = await ProductService.updateProduct(productId, updatedProduct);
        if (!product) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Product not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Product updated', product } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error updating product.' } });
    }
});

// DELETE product by ID
router.delete('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await ProductService.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Product not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Product deleted', product: deletedProduct } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error deleting product.' } });
    }
});

module.exports = router;
