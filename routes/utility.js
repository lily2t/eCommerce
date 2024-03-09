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
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Database already populated' } });
        }

        // Populate roles table
        await db.Role.bulkCreate([
            { id: 1, name: 'Admin' },
            { id: 2, name: 'User' }
        ]);

        // Create initial Admin user
        const hashedPassword = await hashPassword('P@ssword2023');
        await db.User.create({
            username: 'Admin',
            password: hashedPassword,
            email: 'admin@noroff.no',
            firstName: 'Admin',
            lastName: 'Support',
            address: 'Online',
            telephoneNumber: '911',
            RoleId: 1 // Admin role
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
        const productsData = JSON.parse(response);

        // Populate products table
        for (const productData of productsData) {
            await db.Product.create({
                name: productData.name,
                description: productData.description,
                unitPrice: productData.unitprice,
                date_added: productData.date_added,
                imgurl: productData.imgurl,
                quantity: productData.quantity,
                isDeleted: productData.isdeleted,
                BrandId: productData.BrandId,
                CategoryId: productData.CategoryId
            });
        }

        return res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Database populated successfully' } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error populating database' } });
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
