// controllers/authController.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

exports.register = async (req, res) => {
    try {
        const { email, username, password, country, city, age, profession, interests } = req.body;

        // 1) Check required
        if (!email || !username || !password || !country) {
            return res.status(400).json({ message: "email, username, password & country are required" });
        }

        // 2) Duplicate?
        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) {
            return res.status(409).json({ message: "User with that email or username already exists" });
        }

        // 3) Hash
        const hash = await bcrypt.hash(password, 12);

        // 4) Create
        const user = await User.create({
            email,
            username,
            password: hash,
            country,
            city,
            age,
            profession,
            interests: interests || [],
        });

        // 5) Sign
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.status(201).json({ user: { id: user._id, email, username }, token });
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

        // check pwd
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // sign token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        res.json({ user: { id: user._id, email: user.email, username: user.username }, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMe = async (req, res) => {
    // req.user is populated by authMiddleware
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
};
