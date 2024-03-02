const express = require('express');
const router = express.Router();
const BrandService = require('../services/brandService');
const ProductService = require('../services/productService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');

// GET all brands
router.get('/', async (req, res) => {
    try {
        const brands = await BrandService.getAllBrands();
        res.status(200).json({ status: 'success', statuscode: 200, data: { brands } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching brands.' } });
    }
});

// GET brand by ID
router.get('/:id', async (req, res) => {
    try {
        const brand = await BrandService.getBrandById(req.params.id);
        if (!brand) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Brand not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { brand } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching brand.' } });
    }
});

// POST new brand (admin only)
router.post('/', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Brand name is required.' } });
        }
        const existingBrand = await BrandService.getBrandByName(name);
        if (existingBrand) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Brand already exists.' } });
        }
        const newBrand = await BrandService.createBrand(name);
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Brand created successfully.', brand: newBrand } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error creating brand.' } });
    }
});

// PUT update brand by ID (admin only)
router.put('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Brand name is required.' } });
        }
        const updatedBrand = await BrandService.updateBrand(req.params.id, name);
        if (!updatedBrand) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Brand not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Brand updated successfully.', brand: updatedBrand } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error updating brand.' } });
    }
});

// DELETE brand by ID (admin only)
router.delete('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const brand = await BrandService.getBrandById(req.params.id);
        if (!brand) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Brand not found.' } });
        }
        const productsWithBrand = await ProductService.getProductsByBrand(req.params.id);
        if (productsWithBrand.length > 0) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Cannot delete brand with associated products.' } });
        }
        await BrandService.deleteBrand(req.params.id);
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Brand deleted successfully.' } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error deleting brand.' } });
    }
});

module.exports = router;
