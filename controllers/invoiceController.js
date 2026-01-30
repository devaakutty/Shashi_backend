const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

exports.createInvoice = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { customer, items, notes = "", discount = 0 } = req.body;

    // Validation
    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({ message: "Customer name & phone required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Upsert customer
    let dbCustomer = await Customer.findOne({ phone: customer.phone });
    if (!dbCustomer) {
      dbCustomer = await Customer.create({
        ...customer,
        createdBy: req.user._id,
      });
    }

    // Build invoice items
    let subtotal = 0;
    let totalTax = 0;
    const invoiceItems = [];

    for (const item of items) {
      const productId = item.product || item._id;
      const quantity = item.quantity || 1;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemSubtotal = product.price * quantity;
      const taxAmount = (itemSubtotal * (product.taxRate || 0)) / 100;

      subtotal += itemSubtotal;
      totalTax += taxAmount;

      invoiceItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        taxRate: product.taxRate || 0,
        taxAmount,
        total: itemSubtotal + taxAmount,
      });

      product.stock -= quantity;
      await product.save();
    }

    const totalAmount = subtotal + totalTax - discount;

    // Payment
    let paymentMethod = "upi";
    let status = "unpaid";
    const note = notes.toLowerCase();

    if (note.includes("cash")) paymentMethod = "cash";
    if (note.includes("card")) paymentMethod = "card";
    if (note.includes("upi")) status = "paid";

    const invoice = await Invoice.create({
      invoiceNumber: `INV-${Date.now()}`,
      customer: dbCustomer._id,
      items: invoiceItems,
      subtotal,
      totalTax,
      discount,
      totalAmount,
      status,
      paymentMethod,
      notes,
      dueDate: new Date(Date.now() + 7 * 86400000),
      paidAt: status === "paid" ? new Date() : null,
      createdBy: req.user._id,
    });

    res.status(201).json(invoice);
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user._id })
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer")
      .populate("createdBy", "name");

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
