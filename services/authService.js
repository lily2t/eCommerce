const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor(db) {
        this.User = db.User;
    }

    async authenticateUser(email, password) {
        const user = await this.User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return { id: user.id, email: user.email, token };
    }
}

module.exports = AuthService;
