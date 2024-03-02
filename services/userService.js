const crypto = require('crypto');

class UserService {
    constructor(db) {
        this.User = db.User;
    }

    async getByEmail(email) {
        return this.User.findOne({ where: { email } });
    }

    async getById(userId) {
        return this.User.findByPk(userId);
    }

    async create(firstName, lastName, email, password, address, telephoneNumber) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.User.create({ firstName, lastName, email, password: hashedPassword, address, telephoneNumber });
    }

    async updateRole(userId, roleId) {
        const user = await this.getById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        user.roleId = roleId;
        await user.save();
        return user;
    }
}

module.exports = UserService;
