const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, address, telephoneNumber } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !address || !telephoneNumber) {
      return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'All fields are required.' } });
    }

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Email already exists.' } });
    }

    const hashedPassword = await crypto.hash(password, 10);

    const newUser = await UserService.create(firstName, lastName, username, email, hashedPassword, address, telephoneNumber);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'You created an account.',
        id: newUser.id,
        email: newUser.email,
        token: token
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error creating user.' } });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Email and password are required.' } });
    }

    const user = await UserService.getByEmail(email);
    if (!user) {
      return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Invalid email or password.' } });
    }

    const isPasswordValid = await crypto.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: 'error', statuscode: 400, data: { result: 'Invalid email or password.' } });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'You are logged in.',
        id: user.id,
        email: user.email,
        token: token
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Error logging in.' } });
  }
});

module.exports = router;
