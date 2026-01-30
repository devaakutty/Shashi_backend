const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    method: {
      type: String,
      enum: ['cash', 'card', 'razorpay', 'bank_transfer', 'upi'],
      required: true
    },

    transactionId: {
      type: String // Razorpay / Bank ref
    },

    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'success'
    },

    paidAt: {
      type: Date,
      default: Date.now
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

module.exports = mongoose.model('Payment', paymentSchema);
