require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route modules
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const setRoutes = require('./routes/setRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require("./routes/progressRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const reportRoutes = require("./routes/reportRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const commentRoutes = require('./routes/commentRoutes');
const quizAttemptRoutes = require('./routes/quizAttemptRoutes');
const app = express();
connectDB();

app.use(cors({
    origin: [
        'https://quizapp-one-cyan.vercel.app',
        'https://flashcards-app-frontend.vercel.app',
        'https://flashcards-app-frontend-neon.vercel.app',
        'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Quiz App Backend!');
});
app.use("/api/auth", authRoutes)
// Mount modular routers
app.use("/api/progress", progressRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/sets', setRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/report", reportRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/quiz-attempts', quizAttemptRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
