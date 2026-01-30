// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0, // in percentage
      min: 0,
    },
    unit: {
      type: String,
      default: 'pcs',
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // must belong to a user
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model('Product', productSchema);
