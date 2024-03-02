const db = require('../models');

const Role = db.Role;

const createRole = async (name) => {
    try {
        const role = await Role.create({ name });
        return role;
    } catch (error) {
        throw new Error('Error creating role');
    }
};

const getAllRoles = async () => {
    try {
        const roles = await Role.findAll();
        return roles;
    } catch (error) {
        throw new Error('Error fetching roles');
    }
};

const getRoleById = async (id) => {
    try {
        const role = await Role.findByPk(id);
        if (!role) {
            throw new Error('Role not found');
        }
        return role;
    } catch (error) {
        throw new Error('Error fetching role');
    }
};

const updateRole = async (id, name) => {
    try {
        const role = await Role.findByPk(id);
        if (!role) {
            throw new Error('Role not found');
        }
        role.name = name;
        await role.save();
        return role;
    } catch (error) {
        throw new Error('Error updating role');
    }
};

const deleteRole = async (id) => {
    try {
        const role = await Role.findByPk(id);
        if (!role) {
            throw new Error('Role not found');
        }
        await role.destroy();
        return 'Role deleted successfully';
    } catch (error) {
        throw new Error('Error deleting role');
    }
};

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
};
