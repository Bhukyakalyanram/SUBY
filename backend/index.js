const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174', // for local dev
      'https://suby-cyan.vercel.app',
      'https://suby-8cob.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // keep this true if using cookies/auth
  })
);

app.use(express.json());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB error:', err));

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
// app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);

app.get('/', (req, res) => res.send('<h1> Welcome to SUBY </h1>'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
