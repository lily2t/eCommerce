const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.query.token;
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Authorization token is required.'
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.error('Failed to authenticate token:', err);
                return res.status(403).json({
                    status: 'error',
                    message: 'Failed to authenticate token.'
                });
            }

            if (!decoded || !decoded.id) {
                console.error('Decoded token does not contain user ID:', decoded);
                return res.status(403).json({
                    status: 'error',
                    message: 'Invalid token.'
                });
            }

            const user = await User.findByPk(decoded.id);
            if (!user) {
                console.error('User not found with ID:', decoded.id);
                return res.status(403).json({
                    status: 'error',
                    message: 'User not found.'
                });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error.'
        });
    }
};


const isAdmin = async (req, res, next) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'User ID not found in request.'
            });
        }


        const user = await User.findByPk(req.user.id);


        if (user && user.RoleId === 1) {
            next();
        } else {
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized access.'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error.'
        });
    }
};

const isRegistered = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'User ID not found in request.'
            });
        }

        const user = await User.findByPk(req.user.id);

        if (user && user.RoleId === 2) {
            next();
        } else {
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized access. User is not registered.'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error.'
        });
    }
};

module.exports = { authenticateJWT, isAdmin, isRegistered };

