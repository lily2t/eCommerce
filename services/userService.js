class UserService {
    constructor(db) {
        this.User = db.User;
    }

    async create(firstName, lastName, userName, email, encryptedPassword, salt, address, telephoneNumber) {
        return this.User.create({
            firstName,
            lastName,
            userName,
            email,
            EncryptedPassword: encryptedPassword,
            salt,
            address,
            telephoneNumber
        });
    }

    async getByEmail(email) {
        return this.User.findOne({ where: { email } });
    }

    async getById(userId) {
        return this.User.findByPk(userId);
    }

    async getRoleIdByEmail(email) {
        const user = await this.User.findOne({ where: { email } });
        return user ? user.RoleId : null;
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
