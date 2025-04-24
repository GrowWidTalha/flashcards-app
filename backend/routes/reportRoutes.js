const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createReport,
    getReportsForSet,
    getReportsByUser
} = require("../controllers/reportController");

// record a new report (auth required)
router.post("/", protect, createReport);

// get all reports for a set (public)
router.get("/set/:setCode", getReportsForSet);

// get current user’s reports (auth required)
router.get("/user", protect, getReportsByUser);

module.exports = router;
