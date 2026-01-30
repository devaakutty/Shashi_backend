const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// Import controller functions
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

// ----------------------
// Expense Routes
// ----------------------

// Get all expenses
router.get('/', protect, getExpenses);

// Create new expense
router.post('/', protect, createExpense);

// Get single expense by ID
router.get('/:id', protect, getExpenseById);

// Update expense by ID
router.put('/:id', protect, updateExpense);

// Delete expense by ID
router.delete('/:id', protect, deleteExpense);

module.exports = router;
