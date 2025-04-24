const express = require("express");
const router = express.Router();
const { recordProgress } = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

router.post("/record", protect, recordProgress);

module.exports = router;
