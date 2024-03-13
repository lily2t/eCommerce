const express = require('express');
const router = express.Router();
const db = require('../models');
const CategoryService = require('../services/categoryService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware.js');
const jsonParser = express.json();

const categoryService = new CategoryService(db);

router.post('/', jsonParser, authenticateJWT, isAdmin, async (req, res) => {
    const { name } = req.body;

    try {
        const category = await categoryService.addCategory(name);
        res.status(201).json({
            status: 'success',
            statuscode: 201, data: {
                result: 'Category added successfully', category
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: {
                result: 'Internal Server Error'
            }
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json({
            status: 'success',
            statuscode: 200, data: {
                result: 'Categories found', categories
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: {
                result: 'Internal Server Error'
            }
        });
    }
});

router.put('/:categoryId', jsonParser, authenticateJWT, isAdmin, async (req, res) => {
    const categoryId = req.params.categoryId;
    const updatedFields = req.body;

    try {
        const category = await categoryService.updateCategory(categoryId, updatedFields);
        res.json({
            status: 'success',
            statuscode: 200, data: {
                result: 'Category updated successfully', category
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: {
                result: 'Internal Server Error'
            }
        });
    }
});

router.delete('/:categoryId', authenticateJWT, isAdmin, async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const category = await categoryService.deleteCategory(categoryId);
        res.json({
            status: 'success',
            statuscode: 200, data: {
                result: 'Category deleted successfully', category
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: {
                result: error.message
            }
        });
    }
});

module.exports = router;
