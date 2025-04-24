const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createRating,
    getRatingsForSet,
    getRatingsByUser
} = require("../controllers/ratingController");

router.post("/", protect, createRating);
router.get("/set/:setCode", getRatingsForSet);
router.get("/user", protect, getRatingsByUser);

module.exports = router;
