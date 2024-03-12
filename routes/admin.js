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


// Route to get all products
router.get('/products', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        const options = {
            hostname: 'localhost',
            port: 3000, 
            path: '/products',
            method: 'GET',
            headers: {
                Authorization: req.headers.authorization
            }
        };

        const request = http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });


            response.on('end', () => {
                const products = JSON.parse(data);
                console.log('The response is:', products);
                res.render('products', { products });
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

// Route to add a new product
router.post('/products', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        http.post('http://localhost:3000/admin/products', req.body, {
            headers: {
                Authorization: req.headers.authorization
            }
        }, (response) => {
        }).on('error', (error) => {
            next(error);
        });
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
        http.get('http://localhost:3000/brands', (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const brands = JSON.parse(data);
                res.render('admin/brands', { brands });
            });
        }).on('error', (error) => {
            next(error);
        });
    } catch (error) {
        next(error);
    }
});

// Categories route
router.get('/categories', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        http.get('http://localhost:3000/categories', (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const categories = JSON.parse(data);
                res.render('admin/categories', { categories });
            });
        }).on('error', (error) => {
            next(error);
        });
    } catch (error) {
        next(error);
    }
});

// Orders route
router.get('/orders', authenticateJWT, isAdmin, async (req, res, next) => {
    try {
        http.get('http://localhost:3000/orders', (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const orders = JSON.parse(data);
                res.render('admin/orders', { orders });
            });
        }).on('error', (error) => {
            next(error);
        });
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
