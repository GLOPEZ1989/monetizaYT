const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/monetizayt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const videoRoutes = require('./routes/videos');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/videos', videoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MonetizaYT API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});