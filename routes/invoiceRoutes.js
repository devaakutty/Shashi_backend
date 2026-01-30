const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
} = require("../controllers/invoiceController");

router.post("/", protect, createInvoice); // ✅ POST /api/invoices
router.get("/", protect, getInvoices);    // ✅ GET /api/invoices
router.get("/:id", protect, getInvoiceById); // ✅ GET /api/invoices/:id

module.exports = router;
