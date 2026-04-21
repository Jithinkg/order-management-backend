require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/database');
const { connectProducer } = require('./src/config/producer');
const { startConsumer } = require('./src/config/consumer');
const { connectPostgres } = require('./src/config/postgres');
const errorHandler = require('./src/middlewares/errorHandler');
const { globalLimiter, authLimiter } = require('./src/middlewares/rateLimiter');
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/product');
const cartRoutes = require('./src/routes/cart');
const orderRoutes = require('./src/routes/order');
const adminRoutes = require('./src/routes/admin');
const computeRoutes = require('./src/routes/compute');

const app = express();

// Set secure HTTP headers
app.use(helmet());

// Parse incoming JSON request bodies
app.use(express.json());

// Strip keys starting with $ from req.body and req.params to prevent NoSQL injection
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$')) {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    });
  };
  sanitize(req.body);
  sanitize(req.params);
  next();
});

// Parse cookies from incoming requests
app.use(cookieParser());

// Apply global rate limiter to all routes
app.use(globalLimiter);

// Health check route — always useful to verify the server is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/compute', computeRoutes);

// Error handler — must be registered after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  await connectPostgres();
  await connectProducer();
  await startConsumer();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
