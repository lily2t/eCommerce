const express = require('express');
const router = express.Router();
const http = require('http');
const db = require('../models');
const crypto = require('crypto');

router.post('/init', async (req, res) => {

    try {
        // Check if database is already populated
        const productsCount = await db.Product.count();
        if (productsCount > 0) {
            return res.status(400).json({
                status: 'error',
                statuscode: 400, data: { result: 'Database already populated' }
            });
        }

        // Populate roles table
        await db.Role.bulkCreate([
            { id: 1, name: 'Admin' },
            { id: 2, name: 'User' }
        ]);

        // Create initial Admin user
        const hashedPassword = await hashPassword('P@ssword2023');
        await db.User.create({
            userName: 'Admin',
            EncryptedPassword: hashedPassword,
            email: 'admin@noroff.no',
            firstName: 'Admin',
            lastName: 'Support',
            address: 'Online',
            telephoneNumber: '911',
            RoleId: 1 
        });

        // Populate membership table
        await db.Membership.bulkCreate([
            { name: 'Bronze', discount_percentage: 0 },
            { name: 'Silver', discount_percentage: 15, min_items: 15, max_items: 30 },
            { name: 'Gold', discount_percentage: 30, min_items: 30 }
        ]);

        // Fetch data from Noroff API
        const noroffApiUrl = 'http://backend.restapi.co.za/items/products';
        const response = await fetchDataFromApi(noroffApiUrl);
        const responseData = JSON.parse(response);
        const productsData = responseData.data;

        for (const productData of productsData) {
            const [brand, createdBrand] = await db.Brand.findOrCreate({
                where: { name: productData.brand }
            });

            const [category, createdCategory] = await db.Category.findOrCreate({
                where: { name: productData.category }
            });

            // Create Product
            await db.Product.create({
                name: productData.name,
                description: productData.description,
                unitPrice: productData.price,
                date_added: productData.date_added,
                imgurl: productData.imgurl,
                quantity: productData.quantity,
                isDeleted: productData.isdeleted,
                BrandId: brand.id,
                CategoryId: category.id
            });
        }

        return res.status(200).json({
            status: 'success',
            statuscode: 200, data: { result: 'Database populated successfully' }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: 'Error populating database' }
        });
    }
});

// POST /search
router.post('/search', async (req, res) => {
    const { searchTerm, category, brand } = req.body;

    try {
        let query = `
            SELECT p.*
            FROM Products p
            INNER JOIN Brands b ON p.BrandId = b.id
            INNER JOIN Categories c ON p.CategoryId = c.id
            WHERE 1=1
        `;
        const replacements = {};

        if (searchTerm) {
            query += ` AND p.name LIKE :searchTerm`;
            replacements.searchTerm = `%${searchTerm}%`;
        }
        if (category) {
            query += ` AND c.name = :category`;
            replacements.category = category;
        }
        if (brand) {
            query += ` AND b.name = :brand`;
            replacements.brand = brand;
        }

        const results = await db.sequelize.query(query, {
            replacements: replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        res.json({
            status: 'success',
            results: results, count: results.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Helper function to fetch data from API
function fetchDataFromApi(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(data);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Helper function to hash password
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
                reject(err);
            } else {
                resolve(hashedPassword.toString('hex'));
            }
        });
    });
}

module.exports = router;
