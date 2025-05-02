// routes/authRoutes.js
const express = require("express");
const {
    register,
    login,
    getMe,
    verifyEmail,
    resendVerification
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

module.exports = router;
