const express = require('express');
const Order = require('../models/Order');
const verifyUser = require('../middlewares/verifyUser'); // separate auth middleware
const router = express.Router();

// Create order after payment
router.post('/', verifyUser, async (req, res) => {
  try {
    const { items, totalAmount, paymentId } = req.body;

    const order = new Order({
      user: req.userId,
      items,
      totalAmount,
      paymentId,
      status: 'paid',
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// Get orders of logged-in user
router.get('/my-orders', verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate(
      'items.product'
    );
    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

module.exports = router;
