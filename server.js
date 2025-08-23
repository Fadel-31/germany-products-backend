const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); 

const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Serving frontend from:', path.join(__dirname, 'frontend/dist')); // <-- updated path

// Debug route to check dist folder
app.get('/debug-files', (req, res) => {
  const frontendDist = path.join(__dirname, 'frontend/dist'); // <-- updated path
  if (!fs.existsSync(frontendDist)) return res.json({ error: 'dist folder not found' });

  const files = fs.readdirSync(frontendDist);
  res.json({ files });
});

// === Serve frontend in production ===
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist'))); // <-- updated path

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend/dist', 'index.html')); // <-- updated path
  });
}

// DB + Start
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB Connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port', process.env.PORT || 5000);
  });
});
