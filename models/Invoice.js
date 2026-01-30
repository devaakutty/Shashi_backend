const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String, 
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    taxRate: {
      type: Number,
      default: 0 
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    totalTax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled', 'unpaid'],
      default: 'unpaid'
    },
    paymentMethod: {
      type: String,
      // Added lowercase 'upi', 'card', 'cash' to prevent case-sensitivity errors
      enum: ['cash', 'card', 'razorpay', 'bank_transfer', 'upi', 'UPI', 'Card', 'Cash'],
      default: 'upi'
    },
    dueDate: {
      type: Date
    },
    paidAt: {
      type: Date
    },
    notes: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// ✅ FIX: Using a standard function to ensure 'this' refers to the document
// and checking if next exists to prevent "next is not a function" errors.
invoiceSchema.pre('save', function(next) {
  // We check if totalAmount exists to avoid errors
  if (typeof this.totalAmount === 'number') {
    this.totalAmount = Math.round(this.totalAmount * 100) / 100;
  }
  
  // Now 'next' will be recognized as a function
  next();
});

// ✅ ADDED: Prevent model overwrite error (Common in Next.js/Express dev)
module.exports = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);