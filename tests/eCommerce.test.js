const express = require('express');
const request = require('supertest');
const URL = 'http://localhost:3000';
const bodyParser = require('body-parser');

describe('API Tests', () => {
    let token;
    let categoryId;
    let productId;

    beforeAll(async () => {
        const credentials = {
            email: 'admin@noroff.no',
            password: 'P@ssword'
        };
        const response = await request(URL)
            .post('/auth/login')
            .send(credentials);
        token = response.body.data.token;
    });

    test('POST /categories - Create category', async () => {
        const newCategory = { name: 'TEST_CATEGORY' };
        const response = await request(URL)
            .post('/categories')
            .set('Authorization', `Bearer ${token}`)
            .send(newCategory);
        expect(response.statusCode).toBe(201);
        expect(response.body.data.result)
            .toEqual('Category added successfully');
        categoryId = response.body.data.category.id;
    });

    test('GET /categories - Get all categories', async () => {
        const response = await request(URL)
            .get('/categories');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.categories.map(category => category.name))
            .toEqual(expect.arrayContaining(['TEST_CATEGORY']));
    });


    test('PUT /categories/:categoryId - Update category', async () => {
        const updatedCategory = { name: 'UPDATED_CATEGORY' };
        const response = await request(URL)
            .put(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedCategory);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.result)
            .toEqual('Category updated successfully');
    });

    test('DELETE /categories/:categoryId - Delete category', async () => {
        const response = await request(URL)
            .delete(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.result)
            .toEqual('Category deleted successfully');
    });

    test('POST /products - Create product', async () => {
        const newProduct = {
            name: 'TEST_PRODUCT',
            description: 'Test product description',
            unitPrice: 10,
            discount: 0,
            date_added: new Date(),
            imgurl: 'test.jpg',
            quantity: 10,
            BrandId: 1,
            CategoryId: 1
        };
        const response = await request(URL)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(newProduct);
        expect(response.statusCode).toBe(201);
        expect(response.body.data.result)
            .toEqual('Product added successfully');
        productId = response.body.data.product.id;
    });

    test('GET /products - Get all products', async () => {
        const response = await request(URL)
            .get('/products');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.products.map(product => product.name)) 
            .toEqual(expect.arrayContaining(['TEST_PRODUCT']));
    });



    test('PUT /products/:productId - Update product', async () => {
        const updatedProduct = { name: 'UPDATED_PRODUCT' };
        const response = await request(URL)
            .put(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedProduct);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.result)
            .toEqual('Product updated successfully');
    });

    test('DELETE /products/:productId - Delete product', async () => {
        const response = await request(URL)
            .delete(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.result)
            .toEqual('Product deleted successfully');
    });

    test('POST /auth/login - Login with valid user', async () => {
        const credentials = { email: 'admin@noroff.no', password: 'P@ssword' };
        const response = await request(URL)
            .post('/auth/login').send(credentials);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.result)
            .toEqual('Login successful');
        expect(response.body.data.token).toBeTruthy();
    });

    test('POST /auth/login - Login with invalid user', async () => {
        const credentials = { email: 'admin@yahoo.com', password: 'aBc123' };
        const response = await request(URL)
            .post('/auth/login').send(credentials);
        expect(response.statusCode).toBe(404);
        expect(response.body.data.result).toEqual('User not found');
    });
});
