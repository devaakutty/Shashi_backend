const Product = require('../models/Product');

/**
 * @desc    Get all active products (Public Menu)
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
  try {
    // ✅ This query allows all active products from Atlas to show up for everyone
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    
    // Log count to verify your 100 items are loading
    console.log(`✅ Loaded ${products.length} products from Atlas`);
    
    res.json(products || []);
  } catch (error) {
    console.error('GetProducts error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

/**
 * @desc    Get single product by ID (Public)
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    console.error('GetProductById error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Needs Login)
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, taxRate, unit, stock, sku } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    let imageData = undefined;
    if (req.file) {
      // Constructs full URL for images uploaded to port 5000
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
      imageData = { url: imageUrl, publicId: req.file.filename };
    }

    const product = await Product.create({
      name,
      description,
      price,
      taxRate,
      unit,
      stock,
      sku,
      image: imageData,
      createdBy: req.user._id, // Set by auth middleware
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('CreateProduct error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

/**
 * @desc    Update product by ID
 * @access  Private
 */
exports.updateProduct = async (req, res) => {
  try {
    // Managers can only edit products they created
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true,
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = ['name', 'description', 'price', 'taxRate', 'unit', 'stock', 'sku'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
      product.image = { url: imageUrl, publicId: req.file.filename };
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('UpdateProduct error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

/**
 * @desc    Soft delete (Deactivate) product
 * @access  Private
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true,
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('DeleteProduct error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};