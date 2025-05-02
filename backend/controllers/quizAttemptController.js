const QuizAttempt = require('../models/QuizAttempt');
const Set = require('../models/Set');
const Question = require('../models/Question');
const User = require('../models/User');

// Record a single answer from a quiz attempt
exports.recordAnswer = async (req, res) => {
    try {
        const { setId, setCode, questionId, questionText, userAnswer, correctAnswer } = req.body;
        const userId = req.user.id;

        // Find if there's an incomplete attempt for this user and set
        let attempt = await QuizAttempt.findOne({
            user: userId,
            set: setId,
            completed: false
        });

        // If no attempt exists, create a new one
        if (!attempt) {
            // Get total questions for this set
            const set = await Set.findById(setId);
            if (!set) {
                return res.status(404).json({ message: 'Set not found' });
            }

            const totalQuestions = await Question.countDocuments({ setId: setId });

            attempt = new QuizAttempt({
                user: userId,
                set: setId,
                setCode,
                totalQuestions,
                answers: [],
                correctAnswers: 0,
                completed: false
            });
        }

        // Check if the question has already been answered in this attempt
        const existingAnswerIndex = attempt.answers.findIndex(a => a.question.toString() === questionId);

        // Determine if the answer is correct
        const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

        // Update correctAnswers count if this is a correct answer
        if (isCorrect && existingAnswerIndex === -1) {
            attempt.correctAnswers += 1;
        } else if (!isCorrect && existingAnswerIndex !== -1 && attempt.answers[existingAnswerIndex].isCorrect) {
            attempt.correctAnswers -= 1;
        }

        // Create the answer object
        const answerObject = {
            question: questionId,
            questionText,
            userAnswer,
            correctAnswer,
            isCorrect
        };

        // Add or update the answer
        if (existingAnswerIndex !== -1) {
            attempt.answers[existingAnswerIndex] = answerObject;
        } else {
            attempt.answers.push(answerObject);
        }

        await attempt.save();

        return res.status(200).json({
            message: 'Answer recorded successfully',
            attemptId: attempt._id
        });
    } catch (error) {
        console.error('Error recording answer:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Complete a quiz attempt
exports.completeAttempt = async (req, res) => {
    try {
        const { attemptId } = req.body;
        const userId = req.user.id;

        const attempt = await QuizAttempt.findOne({
            _id: attemptId,
            user: userId
        });

        if (!attempt) {
            return res.status(404).json({ message: 'Attempt not found' });
        }

        attempt.completed = true;
        await attempt.save();

        return res.status(200).json({
            message: 'Quiz attempt completed successfully',
            attempt
        });
    } catch (error) {
        console.error('Error completing attempt:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all attempts for a user
exports.getUserAttempts = async (req, res) => {
    try {
        const userId = req.user.id;

        const attempts = await QuizAttempt.find({ user: userId })
            .populate('set', 'setName setCode')
            .sort({ createdAt: -1 });

        return res.status(200).json(attempts);
    } catch (error) {
        console.error('Error fetching user attempts:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get attempts for a specific set
exports.getSetAttempts = async (req, res) => {
    try {
        const { setId } = req.params;
        const userId = req.user.id;

        const attempts = await QuizAttempt.find({
            user: userId,
            set: setId
        }).sort({ createdAt: -1 });

        return res.status(200).json(attempts);
    } catch (error) {
        console.error('Error fetching set attempts:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get attempt details
exports.getAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const userId = req.user.id;

        const attempt = await QuizAttempt.findOne({
            _id: attemptId,
            user: userId
        }).populate('set', 'setName setCode');

        if (!attempt) {
            return res.status(404).json({ message: 'Attempt not found' });
        }

        return res.status(200).json(attempt);
    } catch (error) {
        console.error('Error fetching attempt details:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
