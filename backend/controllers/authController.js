// controllers/authController.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const { sendVerificationEmail } = require("../utils/emailService");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

exports.register = async (req, res) => {
    try {
        const { email, username, password, country, city, age, profession, interests } = req.body;

        // 1) Check required fields
        if (!email || !username || !password || !country) {
            return res.status(400).json({ message: "email, username, password & country are required" });
        }

        // 2) Duplicate?
        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) {
            return res.status(409).json({ message: "User with that email or username already exists" });
        }

        // 3) Hash password
        const hash = await bcrypt.hash(password, 12);

        // 4) Create unverified user
        const user = await User.create({
            email,
            username,
            password: hash,
            country,
            city,
            age,
            profession,
            interests: interests || [],
            isVerified: false
        });

        // 5) Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // 6) Save token to database
        await VerificationToken.create({
            user: user._id,
            token: verificationToken,
            email: user.email
        });

        // 7) Send verification email
        try {
            await sendVerificationEmail(email, username, verificationToken);
        } catch (error) {
            console.error("Error sending verification email:", error);
            // Continue with registration even if email fails
        }

        // 8) Don't generate a token for unverified users
        res.status(201).json({
            user: { id: user._id, email, username, isVerified: false },
            message: "Registration successful. Please check your email to verify your account."
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: "Please provide email/username and password" });
        }

        // find by email OR username
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // check password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // If email not verified, notify user but don't send a token
        if (!user.isVerified) {
            const existingToken = await VerificationToken.findOne({ user: user._id });

            // Generate a new token if none exists
            if (!existingToken) {
                const verificationToken = crypto.randomBytes(32).toString('hex');

                await VerificationToken.create({
                    user: user._id,
                    token: verificationToken,
                    email: user.email
                });

                try {
                    await sendVerificationEmail(user.email, user.username, verificationToken);
                } catch (error) {
                    console.error("Error sending verification email:", error);
                }
            }

            return res.status(401).json({
                isVerified: false,
                message: "Email not verified. Please check your email for the verification link or request a new one."
            });
        }

        // sign token with normal expiration for verified users
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.json({
            user: { id: user._id, email: user.email, username: user.username, isVerified: user.isVerified },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const verificationToken = await VerificationToken.findOne({ token });

        if (!verificationToken) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        // Update user to verified
        await User.findByIdAndUpdate(
            verificationToken.user,
            { isVerified: true }
        );

        // Delete the verification token
        await VerificationToken.findByIdAndDelete(verificationToken._id);

        // Create authenticated token with full expiry now that email is verified
        const user = await User.findById(verificationToken.user).select("-password");
        const newToken = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return res.status(200).json({
            message: "Email successfully verified",
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                isVerified: true
            },
            token: newToken
        });
    } catch (error) {
        console.error("Error verifying email:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Delete any existing tokens
        await VerificationToken.deleteMany({ user: user._id });

        // Create new token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        await VerificationToken.create({
            user: user._id,
            token: verificationToken,
            email: user.email
        });

        // Send verification email
        await sendVerificationEmail(user.email, user.username, verificationToken);

        return res.status(200).json({ message: "Verification email resent successfully" });
    } catch (error) {
        console.error("Error resending verification:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.getMe = async (req, res) => {
    // req.user is populated by authMiddleware
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
};
