const express = require('express');
const router = express.Router();
const db = require('../models');
const BrandService = require('../services/brandService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware.js');
const jsonParser = express.json();

const brandService = new BrandService(db);

router.post('/', jsonParser, authenticateJWT, isAdmin, async (req, res) => {
    const { name } = req.body;

    try {
        const brand = await brandService.addBrand(name);
        res.status(201).json({
            status: 'success',
            statuscode: 201, data: { result: 'Brand added successfully', brand }
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
    try {
        const brands = await brandService.getAllBrands();
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Brands found', brands }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: 'Internal Server Error' }
        });
    }
});

router.put('/:brandId', jsonParser, authenticateJWT, isAdmin, async (req, res) => {
    const brandId = req.params.brandId;
    const updatedFields = req.body;

    try {
        const brand = await brandService.updateBrand(brandId, updatedFields);
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Brand updated successfully', brand }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: 'Internal Server Error' }
        });
    }
});

router.delete('/:brandId', authenticateJWT, isAdmin, async (req, res) => {
    const brandId = req.params.brandId;

    try {
        const brand = await brandService.deleteBrand(brandId);
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Brand deleted successfully', brand }
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
