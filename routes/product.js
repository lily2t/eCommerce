const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductService = require('../services/productService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware.js');
const jsonParser = express.json();

const productService = new ProductService(db);

router.post('/', jsonParser, authenticateJWT, isAdmin, async (req, res) => {
    /* #swagger.tags = ['Products']
       #swagger.description = "Add a new product."
       #swagger.parameters['body'] = {
           in: "body",
           description: "Product details to be added.",
           required: true,
           schema: {
               $ref: "#/definitions/AddProductRequest"
           }
       } */
    const { name, description, unitPrice, discount, date_added, imgurl, quantity, BrandId, CategoryId } = req.body;

    try {
        const product = await productService.addProduct(name, description, unitPrice, discount, date_added, imgurl, quantity, BrandId, CategoryId);
        res.status(201).json({
            status: 'success',
            statuscode: 201, data: { result: 'Product added successfully', product }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: 'Internal Server Error' }
        });
    }
});

router.get('/', async (req, res) => {
    /* #swagger.tags = ['Products']
       #swagger.description = "Get all products." */
    try {
        const products = await productService.getAllProducts();
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Products found', products }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: 'Internal Server Error' }
        });
    }
});

router.put('/:productId', isAdmin, jsonParser, async (req, res) => {
    /* #swagger.tags = ['Products']
       #swagger.description = "Update product by ID."
       #swagger.parameters['productId'] = {
           "name": "productId",
           "in": "path",
           "required": true,
           "type": "integer"
       }
       #swagger.parameters['body'] = {
           in: "body",
           description: "Updated product fields.",
           required: true,
           schema: {
               $ref: "#/definitions/UpdateProductRequest"
           }
       } */
    const productId = req.params.productId;
    const updatedFields = req.body;

    try {
        const product = await productService.updateProduct(productId, updatedFields);
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Product updated successfully', product }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: 'Internal Server Error' }
        });
    }
});

router.delete('/:productId', isAdmin, async (req, res) => {
    /* #swagger.tags = ['Products']
       #swagger.description = "Soft delete product by ID."
       #swagger.parameters['productId'] = {
           "name": "productId",
           "in": "path",
           "required": true,
           "type": "integer"
       } */
    const productId = req.params.productId;

    try {
        const product = await productService.softDeleteProduct(productId);
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Product deleted successfully', product }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: 'Internal Server Error' }
        });
    }
});

module.exports = router;
