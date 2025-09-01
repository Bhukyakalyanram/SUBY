const express = require('express');
const path = require('path');
const productController = require('../controllers/productController');
const Product = require('../models/Product');
const router = express.Router();

// Add product
router.post('/add-product/:firmId', productController.addProduct);

// ⚡️ Place search route BEFORE dynamic :firmId route
router.get('/search-products', async (req, res) => {
  const { q } = req.query; // query param: ?q=pizza
  if (!q) {
    return res.status(400).json({ message: "Query parameter 'q' is required" });
  }

  try {
    const regex = new RegExp(q, 'i'); // case-insensitive search
    const products = await Product.find({ productName: regex });
    return res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get products by firm
router.get('/:firmId/products', productController.getProductByFirm);

// Serve product images
router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.setHeader('Content-Type', 'image/jpeg');
  res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

// Delete product
router.delete('/:productId', productController.deleteProductById);

router.get('/popular', productController.getPopularProducts);
module.exports = router;
