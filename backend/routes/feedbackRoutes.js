const express = require("express");
const router = express.Router();
const {
    createFeedback,
    getAllFeedback
} = require("../controllers/feedbackController");

// Create new feedback
router.post("/", createFeedback);

// Get all feedback
router.get("/", getAllFeedback);

module.exports = router;
