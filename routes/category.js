const express = require('express');
const router = express.Router();
const CategoryService = require('../services/categoryService');
const ProductService = require('../services/productService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.status(200).json({ status: 'success', statuscode: 200, data: { categories } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching categories.' } });
    }
});

// GET category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await CategoryService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Category not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { category } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching category.' } });
    }
});

// POST new category (admin only)
router.post('/', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Category name is required.' } });
        }
        const existingCategory = await CategoryService.getCategoryByName(name);
        if (existingCategory) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Category already exists.' } });
        }
        const newCategory = await CategoryService.createCategory(name);
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Category created successfully.', category: newCategory } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error creating category.' } });
    }
});

// PUT update category by ID (admin only)
router.put('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Category name is required.' } });
        }
        const updatedCategory = await CategoryService.updateCategory(req.params.id, name);
        if (!updatedCategory) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Category not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Category updated successfully.', category: updatedCategory } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error updating category.' } });
    }
});

// DELETE category by ID (admin only)
router.delete('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const category = await CategoryService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Category not found.' } });
        }
        const productsInCategory = await ProductService.getProductsByCategory(req.params.id);
        if (productsInCategory.length > 0) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Cannot delete category with associated products.' } });
        }
        await CategoryService.deleteCategory(req.params.id);
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Category deleted successfully.' } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error deleting category.' } });
    }
});

module.exports = router;
