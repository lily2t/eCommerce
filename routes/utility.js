const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const MembershipService = require('../services/membershipService');
const RoleService = require('../services/roleService');
const ProductService = require('../services/productService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');

// POST initial database population
router.post('/init', async (req, res) => {
    try {
        const roles = await RoleService.initRoles();
        const adminRole = roles.find(role => role.name === 'Admin');

        // Create initial admin user
        const adminUser = {
            firstName: 'Admin',
            lastName: 'Support',
            username: 'Admin',
            email: 'admin@noroff.no',
            password: 'P@ssword2023',
            address: 'Online',
            telephoneNumber: '911',
            roleId: adminRole.id
        };
        await UserService.createAdmin(adminUser);

        // Populate membership table
        await MembershipService.initMembership();

        // Populate database with data from external API (Noroff API)
        const products = await ProductService.populateProducts();

        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Database initialized.', products } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error initializing database.' } });
    }
});

// POST search records in the database
router.post('/search', async (req, res) => {
    try {
        const { searchQuery } = req.body;
        if (!searchQuery) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Search query is required.' } });
        }

        const searchResults = await ProductService.searchProducts(searchQuery);
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Search completed.', searchResults } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error searching records.' } });
    }
});

module.exports = router;
