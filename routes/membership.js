const express = require('express');
const router = express.Router();
const db = require('../models');
const MembershipService = require('../services/membershipService');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware.js');
const jsonParser = express.json();

const membershipService = new MembershipService(db);

router.post('/', jsonParser, authenticateJWT, isAdmin, async (req, res) => {
    /* #swagger.tags = ['Memberships']
       #swagger.description = "Add a new membership."
       #swagger.parameters['body'] = {
           in: "body",
           description: "Membership details to be added.",
           required: true,
           schema: {
               $ref: "#/definitions/AddMembershipRequest"
           }
       } */
    const { name, discount_percentage, min_items, max_items } = req.body;

    try {
        const membership = await membershipService.createMembership(name, discount_percentage, min_items, max_items);
        res.status(201).json({
            status: 'success',
            statuscode: 201, data: { result: 'Membership added successfully', membership }
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
    /* #swagger.tags = ['Memberships']
       #swagger.description = "Get all memberships." */
    try {
        const memberships = await membershipService.getAllMemberships();
        res.json({
            status: 'success',
            statuscode: 200, data: { result: 'Memberships found', memberships }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            statuscode: 500, data: { result: 'Internal Server Error' }
        });
    }
});

router.put('/:membershipId', authenticateJWT, isAdmin, jsonParser, async (req, res) => {
    /* #swagger.tags = ['Memberships']
       #swagger.description = "Update a membership by ID."
       #swagger.parameters['membershipId'] = {
           "name": "membershipId",
           "in": "path",
           "required": true,
           "type": "integer"
       }
       #swagger.parameters['body'] = {
           in: "body",
           description: "Updated membership details.",
           required: true,
           schema: {
               $ref: "#/definitions/UpdateMembershipRequest"
           }
       } */
    const membershipId = req.params.membershipId;
    const updatedFields = req.body;

    try {
        const membership = await membershipService.updateMembership(membershipId, updatedFields);
        res.json({
            status: 'success',
            statuscode: 200, data: {
                result: 'Membership updated successfully',
                membership
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

router.delete('/:membershipId', authenticateJWT, isAdmin, async (req, res) => {
    /* #swagger.tags = ['Memberships']
       #swagger.description = "Delete a membership by ID."
       #swagger.parameters['membershipId'] = {
           "name": "membershipId",
           "in": "path",
           "required": true,
           "type": "integer"
       } */
    const membershipId = req.params.membershipId;

    try {
        const membership = await membershipService.deleteMembership(membershipId);
        res.json({
            status: 'success',
            statuscode: 200, data: {
                result: 'Membership deleted successfully', membership
            }
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
