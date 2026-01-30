const Expense = require('../models/Expense');

/**
 * @desc    Create expense
 * @route   POST /api/expenses
 * @access  Private
 */
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, expenseDate, notes } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: 'Title and amount are required' });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      paymentMethod,
      expenseDate,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all expenses
 * @route   GET /api/expenses
 * @access  Private
 */
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user._id })
      .sort({ expenseDate: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single expense
 * @route   GET /api/expenses/:id
 * @access  Private
 */
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const fields = ['title', 'amount', 'category', 'paymentMethod', 'expenseDate', 'notes'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        expense[field] = req.body[field];
      }
    });

    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
