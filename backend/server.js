const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDB } = require('./database');
const errorHandler = require('./middleware/errorHandler');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : '*';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Routes setup
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/notifications', require('./routes/notifications'));

// Root endpoint for status check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Urban Harvest Hub API is running',
    timestamp: new Date()
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Initialize DB and start listening
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`\n======================================`);
      console.log(`Urban Harvest Hub Server is running on port ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`======================================\n`);
    });
  } catch (err) {
    console.error('Failed to start server due to database error:', err);
    process.exit(1);
  }
}

startServer();
