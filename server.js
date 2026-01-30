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

app.disable('etag');

// ✅ FIX: Only create directories if NOT running on Vercel
// Vercel will crash if it tries to write to the file system
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const uploadPath = path.join(__dirname, 'uploads', 'products');
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('📁 Created directory: uploads/products');
    }
}

app.use(express.json());
app.use(morgan('dev'));

// ✅ FIX: Update CORS to allow your Vercel frontend URL
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://192.168.1.9:3000',
        /\.vercel\.app$/ // This allows all your Vercel preview deployments
    ], 
    credentials: true
}));

app.use('/uploads', (req, res, next) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.resolve(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: '🚀 ShaShi Chocolate & Dessert API is running',
        status: 'Cloud Atlas Connected'
    });
});

const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;