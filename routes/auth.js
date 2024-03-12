const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../models');
const UserService = require('../services/userService');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');

const userService = new UserService(db);
// POST /auth/login
router.post('/login', jsonParser, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getByEmail(email);
    if (!user) {
      return res.status(404).json({ status: 'error', statuscode: 404, data: { result: 'User not found' } });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) {
          reject(err);
        } else {
          resolve(hashedPassword.toString('hex'));
        }
      });
    });

    let token;
    try {
      token = jwt.sign(
        { id: user.id, email: user.Email },
        process.env.TOKEN_SECRET,
        { expiresIn: "2hr" }
      );
    } catch (err) {
      res.status(500).jsend.error("Something went wrong with creating JWT token")
    }

    res.json({
      status: 'success',
      statuscode: 200,
      data: {
        result: 'Login successful',
        id: user.id,
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        token: token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      statuscode: 500, data: {
        result:
          'Internal Server Error'
      }
    });
  }
});

//login only for admin
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('The user is from auth router: ', req.body);

  try {
    const user = await userService.getByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        statuscode: 404,
        data: {
          result: 'User not found'
        }
      });
    }

    const userRoleId = await userService.getRoleIdByEmail(email);
    if (userRoleId !== 1) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized access. Only admins are allowed to login.'
      });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 310000, 32, 'sha256',
        (err, hashedPassword) => {
          if (err) {
            reject(err);
          } else {
            resolve(hashedPassword.toString('hex'));
          }
        });
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '2hr' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Admin login successful',
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});


// POST /auth/register
router.post('/register', jsonParser, async (req, res) => {
  const { firstName, lastName, userName, email, password, address, telephoneNumber } = req.body;

  try {
    if (!firstName || !lastName || !userName || !email || !password || !address || !telephoneNumber) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400, data: { result: 'All fields are required' }
      });
    }

    const existingUser = await userService.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        statuscode: 400, data: { result: 'User already exists' }
      });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) {
          reject(err);
        } else {
          resolve(hashedPassword.toString('hex'));
        }
      });
    });

    const newUser = await userService.create(firstName, lastName, userName, email, hashedPassword, salt, address, telephoneNumber);

    res.status(201).json({ status: 'success', statuscode: 200, data: { result: 'User created successfully' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', statuscode: 500, data: { result: 'Internal Server Error' } });
  }
});

module.exports = router;
