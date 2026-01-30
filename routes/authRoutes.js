const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes (requires JWT)
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);

module.exports = router;
