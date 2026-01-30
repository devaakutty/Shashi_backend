const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');

/**
 * @desc    Create customer
 * @route   POST /api/customers
 * @access  Private
 */
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Private
 */
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single customer
 * @route   GET /api/customers/:id
 * @access  Private
 */
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update customer
 * @route   PUT /api/customers/:id
 * @access  Private
 */
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const fields = ['name', 'email', 'phone', 'address', 'notes'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        customer[field] = req.body[field];
      }
    });

    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete customer
 * @route   DELETE /api/customers/:id
 * @access  Private
 */
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const invoiceCount = await Invoice.countDocuments({ customer: customer._id });

    if (invoiceCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete customer with existing invoices'
      });
    }

    await customer.deleteOne();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
