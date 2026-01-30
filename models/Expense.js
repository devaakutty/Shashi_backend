const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      enum: ['office', 'travel', 'utilities', 'marketing', 'salary', 'other'],
      default: 'other'
    },

    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'upi'],
      default: 'cash'
    },

    expenseDate: {
      type: Date,
      default: Date.now
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

module.exports = mongoose.model('Expense', expenseSchema);
