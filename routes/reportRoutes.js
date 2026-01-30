const express = require("express");
const router = express.Router();
const { getDailyReport } = require("../controllers/reportController");

router.get("/daily", getDailyReport);

module.exports = router;
