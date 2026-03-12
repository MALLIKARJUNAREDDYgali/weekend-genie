const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const generateRoutes = require('./routes/generate');
const historyRoutes = require('./routes/history');
const imageRoutes = require('./routes/images');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
          origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
          credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
          res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
          .then(() => {
                    console.log('✅ Connected to MongoDB');
                    app.listen(PORT, () => {
                              console.log(`🚀 Server running on http://localhost:${PORT}`);
                    });
          })
          .catch((err) => {
                    console.error('❌ MongoDB connection error:', err.message);
                    console.log('\n💡 Make sure MongoDB is running locally.');
                    console.log('   Start MongoDB with: mongod');
                    console.log('   Or check MongoDB Compass is connected.\n');
                    process.exit(1);
          });
