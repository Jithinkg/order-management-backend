require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middlewares/errorHandler');
const authRoutes = require('./src/routes/auth');

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Parse cookies from incoming requests
app.use(cookieParser());

// Health check route — always useful to verify the server is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handler — must be registered after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
