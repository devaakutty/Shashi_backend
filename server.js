// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.disable('etag'); // optional, disables caching

// ✅ Create uploads folder locally (Vercel doesn't allow fs writes)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const uploadPath = path.join(__dirname, 'uploads', 'products');
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('📁 Created directory: uploads/products');
    }
}

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// ✅ CORS Setup
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    // allow localhost
    if (origin.includes('localhost:3000')) return callback(null, true);

    // allow any Vercel frontend preview or production
    if (origin.includes('.vercel.app')) return callback(null, true);

    // block others
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ✅ Serve uploads with cross-origin resource policy
app.use('/uploads', (req, res, next) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.resolve(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: '🚀 ShaShi Chocolate & Dessert API is running',
        status: 'Cloud Atlas Connected'
    });
});

// Error middlewares
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;
