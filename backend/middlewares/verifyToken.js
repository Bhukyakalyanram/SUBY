// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
  let token = req.headers['token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.WhatIsYourName);

    // Check user first
    const user = await User.findById(decoded.id);
    if (user) {
      req.userId = user._id;
      req.userRole = 'user';
      return next();
    }

    // Then vendor
    const vendor = await Vendor.findById(decoded.vendorId);
    if (vendor) {
      req.vendorId = vendor._id;
      req.userRole = 'vendor';
      return next();
    }

    return res.status(404).json({ error: 'User or Vendor not found' });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
