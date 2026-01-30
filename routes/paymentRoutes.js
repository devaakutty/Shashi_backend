const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// Import controller functions
const {
  createPayment,
  getPayments,
  getPaymentsByInvoice,
} = require('../controllers/paymentController');

// ----------------------
// Routes
// ----------------------

// Get all payments for logged-in user
router.get('/', protect, getPayments);

// Create a new payment
router.post('/', protect, createPayment);

// Get all payments for a specific invoice
router.get('/invoice/:invoiceId', protect, getPaymentsByInvoice);

module.exports = router;
