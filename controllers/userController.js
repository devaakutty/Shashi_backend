const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

/**
 * @desc    Update current logged-in user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // will be hashed by model

    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('UpdateProfile Error:', error);
    return res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};
