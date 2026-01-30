const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// Import controller functions
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

// Routes
router.get('/', protect, getCustomers);
router.post('/', protect, createCustomer);
router.get('/:id', protect, getCustomerById);
router.put('/:id', protect, updateCustomer);
router.delete('/:id', protect, deleteCustomer);

module.exports = router;
