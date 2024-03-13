const express = require('express');
const http = require('http');
const router = express.Router();
const axios = require('axios');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware.js');

router.get('/', (req, res) => {
    res.render('admin/login');
});


router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.render('login',
                {
                    message: 'Username and password are required'
                })
            return res.status(400).json({
                status: 'error',
                message: 'Username and password are required'
            });
        }

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/auth/admin/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const request = http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const responseData = JSON.parse(data);

                if (response.statusCode === 200) {
                    const token = responseData.token;
                    res.redirect(`/admin/dashboard?token=${token}`);
                } else {
                    res.render('admin/login', {
                        error: responseData.data
                    });
                }
            });
        });

        request.on('error', (error) => {
            next(error);
        });

        request.write(JSON.stringify({ email: username, password }));
        request.end();
    } catch (error) {
        next(error);
    }
});

// Dashboard route
router.get('/dashboard', authenticateJWT, async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is required for accessing the dashboard.'
            });
        }
        res.render('admin/dashboard', { token });
    } catch (error) {
        next(error);
    }
});


router.get('/products', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is required for accessing the dashboard.'
            });
        }

        const options = {
            hostname: 'localhost',
            port: 3000, 
            path: '/products',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}` 
            }
        };

        const request = http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const responseData = JSON.parse(data);

                if (responseData.status === 'success') {
                    const products = responseData.data.products;
                    res.render('admin/products', { products });
                } else {
                    res.status(responseData.statuscode).json(responseData);
                }
            });
        });

        request.on('error', (error) => {
            next(error);
        });

        request.end();
    } catch (error) {
        next(error);
    }
});


router.post('/products', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is required for accessing the dashboard.'
            });
        }

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/admin/products',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const request = http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const responseData = JSON.parse(data);

                if (response.statusCode === 201) {
                    res.json(responseData);
                } else {
                    res.status(response.statusCode).json(responseData);
                }
            });
        });

        request.on('error', (error) => {
            next(error);
        });

        request.write(JSON.stringify(req.body));
        request.end();
    } catch (error) {
        next(error);
    }
});


// Route to update a product
router.put('/products/:productId', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        http.put(`http://localhost:3000/admin/products/${req.params.productId}`, req.body, { headers: { Authorization: req.headers.authorization } }, (response) => {
        }).on('error', (error) => {
            next(error);
        });
    } catch (error) {
        next(error);
    }
});

// Route to delete a product (soft delete)
router.delete('/products/:productId', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        http.delete(`http://localhost:3000/admin/products/${req.params.productId}`, { headers: { Authorization: req.headers.authorization } }, (response) => {

        }).on('error', (error) => {
            next(error);
        });
    } catch (error) {
        next(error);
    }
});

// Brands route
router.get('/brands', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is required for accessing the dashboard.'
            });
        }

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/brands',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const request = http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const responseData = JSON.parse(data);

                if (responseData.status === 'success') {
                    const brands = responseData.data.brands;
                    res.render('admin/brands', { brands });
                } else {
                    res.status(responseData.statuscode).json(responseData);
                }
            });
        });

        request.on('error', (error) => {
            next(error);
        });

        request.end();
    } catch (error) {
        next(error);
    }
});


// Categories route
router.get('/categories', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is required for accessing the dashboard.'
            });
        }

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/categories',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const request = http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const responseData = JSON.parse(data);

                if (responseData.status === 'success') {
                    const categories = responseData.data.categories;
                    res.render('admin/categories', { categories });
                } else {
                    res.status(responseData.statuscode).json(responseData);
                }
            });
        });

        request.on('error', (error) => {
            next(error);
        });

        request.end();
    } catch (error) {
        next(error);
    }
});


// Orders route
router.get('/orders', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'Token is required for accessing the dashboard.'
            });
        }

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/orders',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const request = http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const responseData = JSON.parse(data);

                if (responseData.status === 'success') {
                    const orders = responseData.data.orders;
                    res.render('admin/orders', { orders });
                } else {
                    res.status(responseData.statuscode).json(responseData);
                }
            });
        });

        request.on('error', (error) => {
            next(error);
        });

        request.end();
    } catch (error) {
        next(error);
    }
});


// Update order status route (admin only)
router.put('/orders/:orderId', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/orders/${orderId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const request = http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode === 200) {
                    const updatedOrder = JSON.parse(data);
                    res.json(updatedOrder);
                } else {
                    next(new Error(`Failed to update order: ${response.statusCode}`));
                }
            });
        });

        request.on('error', (error) => {
            next(error);
        });

        request.write(JSON.stringify({ status }));
        request.end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
