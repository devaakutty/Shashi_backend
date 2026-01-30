const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

/**
 * @desc    Create payment
 * @route   POST /api/payments
 * @access  Private
 */
exports.createPayment = async (req, res) => {
  try {
    const { invoiceId, amount, method, transactionId } = req.body;

    // Validate input
    if (!invoiceId || !amount || !method) {
      return res.status(400).json({
        message: 'Invoice, amount and payment method are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: 'Payment amount must be greater than zero'
      });
    }

    // Find invoice
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Prevent overpayment
    const remainingAmount =
      invoice.totalAmount - (invoice.paidAmount || 0);

    if (amount > remainingAmount) {
      return res.status(400).json({
        message: `Payment exceeds remaining balance of ₹${remainingAmount}`
      });
    }

    // Create payment
    const payment = await Payment.create({
      invoice: invoiceId,
      amount,
      method,
      transactionId,
      createdBy: req.user._id
    });

    // Update invoice payment details
    invoice.paidAmount = (invoice.paidAmount || 0) + amount;
    invoice.paymentMethod = method;

    if (invoice.paidAmount === invoice.totalAmount) {
      invoice.status = 'paid';
      invoice.paidAt = new Date();
    } else {
      invoice.status = 'partial';
    }

    await invoice.save();

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment,
      invoiceStatus: invoice.status,
      paidAmount: invoice.paidAmount,
      remainingAmount: invoice.totalAmount - invoice.paidAmount
    });
  } catch (error) {
    console.error('CreatePayment error:', error);
    res.status(500).json({
      message: 'Server error: ' + error.message
    });
  }
};

/**
 * @desc    Get all payments
 * @route   GET /api/payments
 * @access  Private
 */
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      createdBy: req.user._id
    })
      .populate('invoice', 'invoiceNumber totalAmount status')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('GetPayments error:', error);
    res.status(500).json({
      message: 'Server error: ' + error.message
    });
  }
};

/**
 * @desc    Get payments by invoice
 * @route   GET /api/payments/invoice/:invoiceId
 * @access  Private
 */
exports.getPaymentsByInvoice = async (req, res) => {
  try {
    const payments = await Payment.find({
      invoice: req.params.invoiceId,
      createdBy: req.user._id
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('GetPaymentsByInvoice error:', error);
    res.status(500).json({
      message: 'Server error: ' + error.message
    });
  }
};
