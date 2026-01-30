const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to MongoDB Atlas Cloud
connectDB();

const app = express();

// 3. Disable 304 Caching for Development
// Ensures you always get fresh 200 OK responses instead of cached 304s
app.disable('etag');

// 4. Auto-Create Upload Directories
const uploadPath = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('📁 Created directory: uploads/products');
}

// 5. Global Middlewares
app.use(express.json());
app.use(morgan('dev'));

// ✅ CORS CONFIGURATION
// Supports both local and network IP for testing on different devices
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.1.9:3000'], 
    credentials: true
}));

// 6. ✅ STATIC FILE SERVING WITH CORS HEADERS
// This allows the frontend to actually display images from the backend port
app.use('/uploads', (req, res, next) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.resolve(__dirname, 'uploads')));

// 7. API Routes
// Note: Using require inside app.use is a clean way to keep the top of the file tidy
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// 8. Root Route
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: '🚀 ShaShi Chocolate & Dessert API is running',
        status: 'Cloud Atlas Connected'
    });
});

// 9. Error Handling Middlewares
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;