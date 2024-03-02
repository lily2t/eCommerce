const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: 'error', message: 'Failed to authenticate token.' });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ status: 'error', message: 'Authorization token is required.' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user.role === 'Admin') {
            next();
        } else {
            return res.status(403).json({ status: 'error', message: 'Unauthorized access.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};

module.exports = { authenticateJWT, isAdmin };
