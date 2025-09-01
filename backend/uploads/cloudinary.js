const { upload, cloudinary } = require('../uploads/cloudinary'); // your cloudinary setup
const Product = require('../models/Product');
const Firm = require('../models/Firm');

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) return res.status(404).json({ message: 'Firm not found' });

    let imageUrl;
    if (req.file) {
      // multer-storage-cloudinary automatically uploads to Cloudinary
      imageUrl = req.file.path; // this is the secure Cloudinary URL
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image: imageUrl, // save Cloudinary URL
      firm: firm._id,
    });

    const savedProduct = await product.save();
    firm.products.push(savedProduct._id);
    await firm.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addProduct: [upload.single('image'), addProduct],
};
