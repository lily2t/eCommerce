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

    async getByUsername(userName) {
        return this.User.findOne({ where: { userName } });
    }

    async getById(userId) {
        return this.User.findByPk(userId);
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

    async validPassword(user, password) {
        const salt = user.salt;
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
        return user.EncryptedPassword === hashedPassword;
    }
}

module.exports = UserService;
