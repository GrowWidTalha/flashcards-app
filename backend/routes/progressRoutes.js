const express = require("express");
const router = express.Router();
const { recordProgress, getRecentProgress } = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

router.post("/record", protect, recordProgress);
router.get("/recent", protect, getRecentProgress);

module.exports = router;
