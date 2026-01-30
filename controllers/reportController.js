const Invoice = require("../models/Invoice");

exports.getDailyReport = async (req, res) => {
  try {
    // Today range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const invoices = await Invoice.find({
      createdAt: { $gte: start, $lte: end },
      status: { $in: ["paid", "sent"] }
    })
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });

    const report = invoices.map(inv => ({
      invoiceNumber: inv.invoiceNumber,
      customerName: inv.customer?.name || "Walk-in",
      products: inv.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      subtotal: inv.subtotal,
      tax: inv.totalTax,
      discount: inv.discount,
      totalAmount: inv.totalAmount,
      paymentMethod: inv.paymentMethod,
      date: inv.createdAt
    }));

    res.json(report);
  } catch (error) {
    console.error("Daily Report Error:", error);
    res.status(500).json({ message: "Daily report failed" });
  }
};
