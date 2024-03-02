const express = require('express');
const router = express.Router();
const MembershipService = require('../services/membershipService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');

// GET all memberships (admin only)
router.get('/', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const memberships = await MembershipService.getAllMemberships();
        res.status(200).json({ status: 'success', statuscode: 200, data: { memberships } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error fetching memberships.' } });
    }
});

// POST new membership (admin only)
router.post('/', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const { name, minItems, maxItems, discount } = req.body;
        if (!name || !minItems || !maxItems || !discount) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'All fields are required.' } });
        }
        const existingMembership = await MembershipService.getMembershipByName(name);
        if (existingMembership) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Membership already exists.' } });
        }
        const newMembership = await MembershipService.createMembership(name, minItems, maxItems, discount);
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Membership created successfully.', membership: newMembership } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error creating membership.' } });
    }
});

// PUT update membership by ID (admin only)
router.put('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const { name, minItems, maxItems, discount } = req.body;
        if (!name || !minItems || !maxItems || !discount) {
            return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'All fields are required.' } });
        }
        const updatedMembership = await MembershipService.updateMembership(req.params.id, name, minItems, maxItems, discount);
        if (!updatedMembership) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Membership not found.' } });
        }
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Membership updated successfully.', membership: updatedMembership } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error updating membership.' } });
    }
});

// DELETE membership by ID (admin only)
router.delete('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const membership = await MembershipService.getMembershipById(req.params.id);
        if (!membership) {
            return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'Membership not found.' } });
        }
        await MembershipService.deleteMembership(req.params.id);
        res.status(200).json({ status: 'success', statuscode: 200, data: { result: 'Membership deleted successfully.' } });
    } catch (error) {
        res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error deleting membership.' } });
    }
});

module.exports = router;
