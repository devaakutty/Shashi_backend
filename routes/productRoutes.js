const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ PUBLIC ROUTES: Anyone can see the menu
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔒 PROTECTED ROUTES: Only logged-in staff can edit
router.post("/", protect, upload.single("image"), createProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;