// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const offerRoutes = require('./routes/offerRoutes');
const recentRoutes = require('./routes/recentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/Uploads/Product', express.static(path.join(__dirname, 'Uploads/Product')));
app.use('/Uploads/Profile', express.static(path.join(__dirname, 'Uploads/Profile')));
app.use('/Uploads/Offer', express.static(path.join(__dirname, 'Uploads/Offer')));

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/category', categoryRoutes);
app.use('/offers', offerRoutes );
app.use('/recent', recentRoutes );
app.use('/like', likeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('API is running');
});