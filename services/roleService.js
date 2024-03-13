const { Role } = require('../models');

class RoleService {
    constructor(db) {
        this.Role = db.Role;
    }

    async createRole(name) {
        try {
            const role = await this.Role.create({ name });
            return role;
        } catch (error) {
            throw new Error('Error creating role');
        }
    }

    async getAllRoles() {
        try {
            const roles = await this.Role.findAll();
            return roles;
        } catch (error) {
            throw new Error('Error fetching roles');
        }
    }

    async getRoleByName(name) {
        try {
            const role = await this.Role.findOne({ where: { name } });
            if (!role) {
                throw new Error('Role not found');
            }
            return role.id;
        } catch (error) {
            throw new Error('Error fetching role by name');
        }
    }

    async getRoleById(id) {
        try {
            const role = await this.Role.findByPk(id);
            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        } catch (error) {
            throw new Error('Error fetching role');
        }
    }

    async updateRole(id, name) {
        try {
            const role = await this.Role.findByPk(id);
            if (!role) {
                throw new Error('Role not found');
            }
            role.name = name;
            await role.save();
            return role;
        } catch (error) {
            throw new Error('Error updating role');
        }
    }

    async deleteRole(id) {
        try {
            const role = await this.Role.findByPk(id);
            if (!role) {
                throw new Error('Role not found');
            }
            await role.destroy();
            return 'Role deleted successfully';
        } catch (error) {
            throw new Error('Error deleting role');
        }
    }
}

module.exports = RoleService;
