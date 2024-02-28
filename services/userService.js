class UserService {
    constructor(db) {
        this.User = db.User;
    }

    async getAllUsers() {
        return this.User.findAll();
    }

    async createUser(userDetails) {
        return this.User.create(userDetails);
    }

    async updateUser(userId, newUserDetails) {
        const existingUser = await this.User.findByPk(userId);

        if (!existingUser) {
            throw new Error("User not found");
        }

        await existingUser.update(newUserDetails);
        return this.getUserById(userId);
    }

    async getUserById(userId) {
        return this.User.findByPk(userId);
    }

    async deleteUser(userId) {
        const deletedRowCount = await this.User.destroy({ where: { id: userId } });
        if (deletedRowCount === 0) {
            throw new Error("User not found");
        }
    }
}

module.exports = UserService;
