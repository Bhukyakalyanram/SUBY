const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.WhatIsYourName;

const verifyUser = async (req, res, next) => {
  let token = req.headers['token'] || req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token is required' });

  if (token.startsWith('Bearer ')) token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.userId = user._id;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyUser;
